/**
 * POST /api/roadmaps/generate
 *
 * Pipeline:
 *   1. Accept { targetRole, skillGaps[] } from the resume analysis step
 *   2. Query Neo4j to find the shortest learning path between skill gaps
 *      and the target role's required skills
 *   3. Send that path context to Gemini Flash to generate a structured roadmap
 *   4. Persist the roadmap + its skill nodes to Supabase
 *   5. Return the full roadmap
 *
 * Auth: Clerk  |  DB: Supabase + Neo4j  |  AI: Gemini Flash
 *
 * Request  — JSON: { targetRole: string, skillGaps: string[] }
 * Response — { roadmap: Roadmap }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";
import { runNeo4jQuery } from "@/lib/neo4j";

// ── Request body schema ────────────────────────────────────────────────────────
const RequestSchema = z.object({
  targetRole: z.string().min(1),
  skillGaps: z.array(z.string()).min(1),
});

// ── Gemini response schema ─────────────────────────────────────────────────────
const RoadmapSchema = z.object({
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

// ── Neo4j: get related skills for a target role ───────────────────────────────
async function getSkillPathFromNeo4j(
  targetRole: string,
  skillGaps: string[]
): Promise<string[]> {
  try {
    return await runNeo4jQuery(async (session) => {
      // Find skills required for the target role that intersect with the gap list
      const result = await session.run(
        `
        MATCH (r:Role {name: $targetRole})-[:REQUIRES]->(s:Skill)
        WHERE s.name IN $skillGaps OR s.category IN $skillGaps
        RETURN s.name AS skill, s.category AS category, s.level AS level
        ORDER BY s.level
        LIMIT 20
        `,
        { targetRole, skillGaps }
      );

      if (result.records.length > 0) {
        return result.records.map((r) => r.get("skill") as string);
      }

      // Fallback: return the raw skillGaps if no graph data yet
      return skillGaps;
    });
  } catch (error) {
    // Neo4j not seeded yet — gracefully fall back to skill gaps directly
    console.warn("[/api/roadmaps/generate] Neo4j fallback:", error);
    return skillGaps;
  }
}

// ── Gemini prompt ──────────────────────────────────────────────────────────────
function buildPrompt(targetRole: string, orderedSkills: string[]): string {
  return `
You are an expert career coach and curriculum designer.

Create a structured learning roadmap for someone targeting the role: "${targetRole}".

They need to learn these skills (in priority order): ${orderedSkills.join(", ")}.

Return ONLY a valid JSON object (no markdown, no explanation) with this shape:
{
  "title": "<roadmap title>",
  "description": "<1-2 sentence overview>",
  "estimatedWeeks": <number>,
  "nodes": [
    {
      "id": "<short-kebab-id>",
      "name": "<skill name>",
      "description": "<what to learn and why>",
      "level": "beginner" | "intermediate" | "advanced",
      "estimatedDays": <number>,
      "resources": [
        {
          "title": "<resource title>",
          "url": "<real URL>",
          "type": "article" | "video" | "course" | "documentation"
        }
      ]
    }
  ]
}

Include 2-3 real, publicly accessible resources per node.
`.trim();
}

export async function POST(request: NextRequest) {
  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Validate request body ───────────────────────────────────────────────
  let body;
  try {
    body = RequestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", details: error },
      { status: 400 }
    );
  }

  const { targetRole, skillGaps } = body;

  // ── 3. Get ordered skill path from Neo4j ──────────────────────────────────
  const orderedSkills = await getSkillPathFromNeo4j(targetRole, skillGaps);

  // ── 4. Generate roadmap with Gemini ───────────────────────────────────────
  let roadmapData;
  try {
    const model = getGeminiFlashModel();
    const result = await model.generateContent(
      buildPrompt(targetRole, orderedSkills)
    );
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    roadmapData = RoadmapSchema.parse(JSON.parse(raw));
  } catch (error) {
    console.error("[/api/roadmaps/generate] Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 502 }
    );
  }

  // ── 5. Persist to Supabase ─────────────────────────────────────────────────
  const db = createServerSupabaseClient();

  const { data: roadmap, error: roadmapError } = await db
    .from("roadmaps")
    .insert({
      user_id: userId,
      title: roadmapData.title,
      description: roadmapData.description,
      target_role: targetRole,
      estimated_weeks: roadmapData.estimatedWeeks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (roadmapError || !roadmap) {
    console.error("[/api/roadmaps/generate] DB error:", roadmapError);
    return NextResponse.json(
      { error: "Failed to save roadmap" },
      { status: 500 }
    );
  }

  // Insert skill nodes linked to this roadmap
  const nodeRows = roadmapData.nodes.map((node) => ({
    roadmap_id: roadmap.id,
    user_id: userId,
    name: node.name,
    description: node.description,
    level: node.level,
    estimated_days: node.estimatedDays,
    status: "not_started",
    resources: node.resources,
  }));

  const { error: nodesError } = await db.from("skill_nodes").insert(nodeRows);
  if (nodesError) {
    console.error("[/api/roadmaps/generate] Nodes DB error:", nodesError);
  }

  return NextResponse.json({
    roadmap: {
      id: roadmap.id,
      ...roadmapData,
    },
  });
}
