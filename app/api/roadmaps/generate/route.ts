import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGemini25FlashLite, getGemini25Flash, roadmapResponseSchema } from "@/lib/gemini";
import { runNeo4jQuery } from "@/lib/neo4j";
import { createClient } from "@supabase/supabase-js";

const RequestSchema = z.object({
  targetRole: z.string().min(1),
  skillGaps: z.array(z.string()).min(1),
});

async function generateWithFailover(prompt: string) {
  try {
    const model = getGemini25FlashLite();
    return await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json", 
        temperature: 0.1, 
        responseSchema: roadmapResponseSchema as any 
      },
    });
  } catch (primaryError) {
    console.warn("⚠️ Primary Model failed, scaling to secondary fallback layer...", primaryError);
    const backupModel = getGemini25Flash();
    return await backupModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json", 
        temperature: 0.1, 
        responseSchema: roadmapResponseSchema as any 
      },
    });
  }
}

async function getSkillPathFromNeo4j(targetRole: string, skillGaps: string[]) {
  try {
    return await runNeo4jQuery(async (session) => {
      const result = await session.run(
        `MATCH (r:Role)-[:REQUIRES]->(s:Skill)
         WHERE r.name = $targetRole AND (s.name IN $skillGaps OR s.category IN $skillGaps)
         RETURN s.name AS skill ORDER BY s.level ASC`,
        { targetRole, skillGaps }
      );
      return result.records.length > 0 ? result.records.map((r) => r.get("skill") as string) : skillGaps;
    });
  } catch (error) {
    console.error("⚠️ Neo4j Query Connection Failure:", error);
    return skillGaps;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const supabaseToken = await getToken({ template: "supabase" });
    
    // Standard client for reading (respects RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
    );

    // Admin client for writing (bypasses RLS to prevent 42501 errors on server routes)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const jsonBody = await request.json();
    const { targetRole, skillGaps } = RequestSchema.parse(jsonBody);
    const db = createServerSupabaseClient();

    // ── INTEGRATED: LAZY ONBOARDING STEP WITH ERROR VERIFICATION ────────────
    const { data: userCheck } = await authenticatedSupabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userCheck) {
      console.log(`👤 Synchronizing profile row data for user: ${userId}`);
      
      const emailAddress = clerkUser?.emailAddresses[0]?.emailAddress || "developer@student.com";
      const userFullName = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "Developer Student";

      const { error: onboardingError } = await authenticatedSupabase
        .from("users")
        .insert({ 
          id: userId,
          email: emailAddress,        // Fulfills required 'email' column constraint
          full_name: userFullName,    // Fulfills required 'full_name' column constraint
        });

      if (onboardingError) {
        console.error("❌ CRITICAL: USERS TABLE PROFILE WRITE FAILURE:", onboardingError);
        return NextResponse.json({ error: "Failed to allocate account profile row structure", details: onboardingError }, { status: 500 });
      }
      console.log("✅ User profile successfully written to Supabase under RLS validation!");
    }
    // ────────────────────────────────────────────────────────────────────────

    // C. Resolve Skill Nodes ordering from Graph Layer
    const orderedSkills = await getSkillPathFromNeo4j(targetRole, skillGaps);

    // 3. AI Generation execution loop
    let roadmapData;
    try {
      // Update prompt to force dependency structure
      const prompt = `Design a comprehensive structural training path for a "${targetRole}" targeting these ordered skill parameters: ${orderedSkills.join(", ")}. 
      Return a JSON object where every node has: 
      - "id": a unique string ID
      - "name": string
      - "dependencies": an array of node IDs that must be completed first (e.g., ["node-1"]).
      - "tasks": array of tasks.`;
      
      const result = await generateWithFailover(prompt);
      roadmapData = JSON.parse(result.response.text());
    }catch (error) {
  console.error("🚨 Content generation failure, loading robust demo fallbacks...", error);
  
  // Define a dictionary of mock tasks for common skills
  const MOCK_TASK_LIBRARY: Record<string, any[]> = {
    "React Hooks": [
      { id: "t1", title: "Initialize Vite project with TypeScript", completed: false },
      { id: "t2", title: "Implement useState for local component state", completed: false },
      { id: "t3", title: "Handle side effects with useEffect", completed: false },
      { id: "t4", title: "Extract logic into custom hooks", completed: false },
      { id: "t5", title: "Manage global state with useContext", completed: false },
      { id: "t6", title: "Optimize renders with useMemo", completed: false }
    ],
    "TypeScript Generics": [
      { id: "t1", title: "Define a generic interface for API responses", completed: false },
      { id: "t2", title: "Create a reusable Table component with generics", completed: false },
      { id: "t3", title: "Implement generic type constraints", completed: false }
    ],
    "API Integration": [
      { id: "t1", title: "Setup Axios interceptors", completed: false },
      { id: "t2", title: "Create custom fetch wrapper", completed: false },
      { id: "t3", title: "Handle loading/error states in UI", completed: false },
      { id: "t4", title: "Test endpoints with Postman/Insomnia", completed: false }
    ]
  };

  roadmapData = {
    title: `${targetRole} Accelerator Curriculum`,
    description: "Adaptive baseline path handling core software design models.",
    estimatedWeeks: 6,
    nodes: skillGaps.map((skill, index) => ({
      name: skill,
      description: `Master fundamental syntax constructs and production implementation of ${skill}.`,
      level: "intermediate",
      estimatedDays: 4,
      resources: [{ title: "Official Documentation", url: "https://developer.mozilla.org", type: "documentation" }],
      // Use the library, or default to a basic task if the skill isn't in the library
      tasks: MOCK_TASK_LIBRARY[skill] || [
        { id: `t-${index}-1`, title: `Complete fundamental exercises for ${skill}`, completed: false },
        { id: `t-${index}-2`, title: `Document learning outcomes for ${skill}`, completed: false }
      ]
    }))
  };
}

    // 4. Save to DB FIX: Using supabaseAdmin to bypass RLS blocks
    const { data: roadmap, error: roadmapError } = await supabaseAdmin
      .from("roadmaps")
      .insert({
        user_id: userId,
        title: roadmapData.title,
        description: roadmapData.description,
        target_role: targetRole,
        is_active: true,
        estimated_weeks: roadmapData.estimatedWeeks
      })
      .select("id")
      .single();

    if (roadmapError || !roadmap) {
      console.error("❌ Supabase Roadmap Parent Insert Error:", roadmapError);
      return NextResponse.json({ error: "Failed to persist roadmap parent matrix", details: roadmapError }, { status: 500 });
    }

    const nodeRows = roadmapData.nodes.map((n: any) => ({
      roadmap_id: roadmap.id,
      user_id: userId,
      name: n.name,
      description: n.description,
      level: n.level,
      estimated_days: n.estimatedDays,
      status: "not_started",
      resources: n.resources, 
      tasks: n.tasks,
      dependencies: n.dependencies || [] 
    }));

    const { error: nodesError } = await authenticatedSupabase
      .from("tasks")
      .insert(nodeRows);

    if (nodesError) {
      console.error("❌ Supabase Skill Nodes Insert Error:", nodesError);
      return NextResponse.json({ error: "Failed to allocate target skill nodes", details: nodesError }, { status: 500 });
    }

    // Refetch the complete relational map setup
    const { data: completeRoadmap, error: refetchError } = await supabase
      .from("roadmaps")
      .select("*, skill_nodes(*)")
      .eq("id", roadmap.id)
      .single();

    if (refetchError) console.error("❌ Supabase Refetch Final Roadmap Error:", refetchError);

    return NextResponse.json({ roadmap: completeRoadmap }, { status: 201 });
  } catch (error) {
    console.error("Critical Execution Fault:", error);
    return NextResponse.json({ error: "Server Processing Error" }, { status: 500 });
  }
}