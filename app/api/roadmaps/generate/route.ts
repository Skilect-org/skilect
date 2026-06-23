// app/api/roadmaps/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel, getGemini15Model } from "@/lib/gemini";
import { runNeo4jQuery } from "@/lib/neo4j";
import { createClient } from "@supabase/supabase-js";

// ── 1. VALIDATION SCHEMAS ───────────────────────────────────────────────────

const RequestSchema = z.object({
  targetRole: z.string().min(1),
  skillGaps: z.array(z.string()).min(1),
});

const RoadmapOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedWeeks: z.number(),
  nodes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      level: z.enum(["beginner", "intermediate", "advanced"]),
      estimatedDays: z.number(),
      resources: z.array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(["article", "video", "course", "documentation"]),
        })
      ),
    })
  ),
});

// ── 2. FAILOVER GENERATOR ──────────────────────────────────────────────────

async function generateWithFailover(prompt: string) {
  // Strategy: Try Primary -> Catch 429/Error -> Try Secondary
  try {
    const model = getGeminiFlashModel();
    return await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1000, temperature: 0.1 },
    });
  } catch (primaryError: any) {
    console.warn("⚠️ Primary Model (2.0) hit limit, switching to Secondary (1.5)...");
    try {
      const backupModel = getGemini15Model();
      return await backupModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1000, temperature: 0.1 },
      });
    } catch (secondaryError) {
      console.error("❌ Both AI models failed.");
      throw secondaryError;
    }
  }
}

// ── 3. GRAPH & PROMPT HELPERS ──────────────────────────────────────────────

async function getSkillPathFromNeo4j(targetRole: string, skillGaps: string[]) {
  try {
    return await runNeo4jQuery(async (session) => {
      const result = await session.run(
        `MATCH (r:Role {name: $targetRole})-[:REQUIRES]->(s:Skill)
         WHERE s.name IN $skillGaps OR s.category IN $skillGaps
         RETURN s.name AS skill ORDER BY s.level LIMIT 20`,
        { targetRole, skillGaps }
      );
      return result.records.length > 0 ? result.records.map((r) => r.get("skill") as string) : skillGaps;
    });
  } catch {
    return skillGaps;
  }
}

function buildPrompt(targetRole: string, orderedSkills: string[]): string {
  return `You are an expert curriculum designer. Generate a roadmap for "${targetRole}" with these skills: ${orderedSkills.join(", ")}. 
  Output ONLY valid JSON. Structure: { title, description, estimatedWeeks, nodes: [{ id, name, description, level, estimatedDays, resources: [{ title, url, type }] }] }`;
}

// ── 4. API ROUTE HANDLER ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const supabaseToken = await getToken({ template: "supabase" });
    const authenticatedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
    );

    // B. Validate
    const jsonBody = await request.json();
    const { targetRole, skillGaps } = RequestSchema.parse(jsonBody);

    // C. CACHE CHECK: Do we already have an active roadmap for this user + role?
    // This stops you from burning quota on repeat requests.
    const { data: existingRoadmap } = await authenticatedSupabase
      .from("roadmaps")
      .select("id, title, description, estimated_weeks, target_role, tasks(*)")
      .eq("user_id", userId)
      .eq("target_role", targetRole)
      .eq("is_active", true)
      .maybeSingle();

    if (existingRoadmap) {
      console.log("⚡ CACHE HIT: Returning existing roadmap from DB.");
      return NextResponse.json({ roadmap: existingRoadmap }, { status: 200 });
    }

    // D. Sync User & Get Neo4j Path
    await authenticatedSupabase.from("users").upsert({
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "user@example.com",
      updated_at: new Date().toISOString()
    });

    const orderedSkills = await getSkillPathFromNeo4j(targetRole, skillGaps);

    // E. Generate AI Content (With Failover)
    let roadmapData;
    try {
      const result = await generateWithFailover(buildPrompt(targetRole, orderedSkills));
      const cleanedText = result.response.text().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      roadmapData = RoadmapOutputSchema.parse(JSON.parse(cleanedText));
    } catch (error) {
      console.warn("🚨 All models failed. Falling back to static design.");
      roadmapData = {
        title: `${targetRole} Roadmap`,
        description: "Standard curriculum path.",
        estimatedWeeks: 6,
        nodes: [{ id: "intro", name: "Fundamentals", description: "Learn basics.", level: "beginner", estimatedDays: 5, resources: [{ title: "Docs", url: "https://docs.com", type: "documentation" }] }]
      };
    }

    // F. Save
    const { data: roadmap, error: roadmapError } = await authenticatedSupabase
      .from("roadmaps")
      .insert({ user_id: userId, title: roadmapData.title, description: roadmapData.description, target_role: targetRole, is_active: true, estimated_weeks: roadmapData.estimatedWeeks })
      .select("id")
      .single();

    if (roadmapError) return NextResponse.json({ error: "Failed to save roadmap" }, { status: 500 });

    const { error: nodesError } = await authenticatedSupabase.from("tasks").insert(
      roadmapData.nodes.map((n) => ({ roadmap_id: roadmap.id, user_id: userId, title: n.name, description: n.description, status: "todo" }))
    );

    return NextResponse.json({ roadmap: { id: roadmap.id, ...roadmapData } }, { status: 201 });

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: "Server Processing Error" }, { status: 500 });
  }
}