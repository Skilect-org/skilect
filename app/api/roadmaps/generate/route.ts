import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGemini25FlashLite, getGemini25Flash, roadmapResponseSchema } from "@/lib/gemini";
import { runNeo4jQuery } from "@/lib/neo4j";
import { createClient } from "@supabase/supabase-js";

const RequestSchema = z.object({
  targetRole: z.string().optional(),
  skillGaps: z.array(z.string()).optional(),
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

const REQUIRED_SKILLS_BY_ROLE: Record<string, string[]> = {
  frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git"],
  backend: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "REST APIs", "Docker", "Git"],
  fullstack: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "PostgreSQL", "Git"],
  "ml-ai": ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn", "Git"],
  "data-science": ["Python", "SQL", "Pandas", "NumPy", "Data Visualization", "Statistics", "Machine Learning", "Git"],
  devops: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Git", "Nginx"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin", "JavaScript", "Mobile Design", "Git"],
  cybersecurity: ["Networking", "Linux", "Penetration Testing", "Security Auditing", "Cryptography", "Identity Access Management", "Git"],
};

function getRequiredSkills(role: string): string[] {
  const normalized = role.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normalized.includes("frontend")) return REQUIRED_SKILLS_BY_ROLE.frontend;
  if (normalized.includes("backend")) return REQUIRED_SKILLS_BY_ROLE.backend;
  if (normalized.includes("fullstack")) return REQUIRED_SKILLS_BY_ROLE.fullstack;
  if (normalized.includes("ml") || normalized.includes("ai") || normalized.includes("artificial")) return REQUIRED_SKILLS_BY_ROLE["ml-ai"];
  if (normalized.includes("datascience") || normalized.includes("data")) return REQUIRED_SKILLS_BY_ROLE["data-science"];
  if (normalized.includes("devops") || normalized.includes("cloud")) return REQUIRED_SKILLS_BY_ROLE.devops;
  if (normalized.includes("mobile") || normalized.includes("ios") || normalized.includes("android")) return REQUIRED_SKILLS_BY_ROLE.mobile;
  if (normalized.includes("security") || normalized.includes("cyber")) return REQUIRED_SKILLS_BY_ROLE.cybersecurity;
  
  return REQUIRED_SKILLS_BY_ROLE.fullstack;
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

    const jsonBody = await request.json().catch(() => ({}));
    const { targetRole, skillGaps } = RequestSchema.parse(jsonBody);

    // ── INTEGRATED: LAZY ONBOARDING/USER SYNC STEP ───────────────────────────
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id, target_role, skills")
      .eq("clerk_id", userId)
      .single();

    const fullName = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Unknown User" : "Unknown User";
    const parts = fullName.split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    const { error: userSyncError } = await supabaseAdmin.from("users").upsert({
      clerk_id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "user@example.com",
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "clerk_id"
    });

    if (userSyncError) console.error("❌ Supabase User Sync Upsert Error:", userSyncError);
    // ────────────────────────────────────────────────────────────────────────

    // Resolve Target Role and Skill Gaps Dynamically
    const finalTargetRole = targetRole || existingUser?.target_role || "Full Stack Developer";
    let finalSkillGaps = skillGaps;

    if (!finalSkillGaps) {
      const userSkills: string[] = existingUser?.skills || [];
      const required = getRequiredSkills(finalTargetRole);
      const lowerUserSkills = new Set(userSkills.map(s => s.toLowerCase()));
      finalSkillGaps = required.filter(s => !lowerUserSkills.has(s.toLowerCase()));
      if (finalSkillGaps.length === 0) {
        finalSkillGaps = required;
      }
    }

    // 1. Cache Check FIX: Handle multiple rows gracefully
    const { data: existingRoadmaps, error: cacheError } = await supabase
      .from("roadmaps")
      .select("*, skill_nodes(*)")
      .eq("user_id", userId)
      .eq("target_role", finalTargetRole)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (cacheError) console.error("❌ Supabase Cache Check Error:", cacheError);

    if (existingRoadmaps && existingRoadmaps.length > 0) {
      return NextResponse.json({ roadmap: existingRoadmaps[0] }, { status: 200 });
    }

    const orderedSkills = await getSkillPathFromNeo4j(finalTargetRole, finalSkillGaps);

    // 3. AI Generation execution loop
    let roadmapData;
    try {
      // Update prompt to force dependency structure
      const prompt = `Design a comprehensive structural training path for a "${finalTargetRole}" targeting these ordered skill parameters: ${orderedSkills.join(", ")}. 
      Return a JSON object where every node has: 
      - "id": a unique string ID
      - "name": string
      - "dependencies": an array of node IDs that must be completed first (e.g., ["node-1"]).
      - "tasks": array of tasks.`;
      
      const result = await generateWithFailover(prompt);
      roadmapData = JSON.parse(result.response.text());
    } catch (error) {
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
        title: `${finalTargetRole} Accelerator Curriculum`,
        description: "Adaptive baseline path handling core software design models.",
        estimatedWeeks: 6,
        nodes: finalSkillGaps.map((skill, index) => ({
          id: `node-${skill.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: skill,
          description: `Master fundamental syntax constructs and production implementation of ${skill}.`,
          level: "intermediate",
          estimatedDays: 4,
          resources: [{ title: "Official Documentation", url: "https://developer.mozilla.org", type: "documentation" }],
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
        target_role: finalTargetRole,
        is_active: true,
        estimated_weeks: roadmapData.estimatedWeeks || 6
      })
      .select("id")
      .single();

    if (roadmapError || !roadmap) {
      console.error("❌ Supabase Roadmap Parent Insert Error:", roadmapError);
      return NextResponse.json({ error: "Failed to allocate roadmap parent matrix", details: roadmapError }, { status: 500 });
    }

    const nodeRows = roadmapData.nodes.map((n: any) => ({
      roadmap_id: roadmap.id,
      user_id: userId,
      name: n.name,
      description: n.description,
      level: n.level || "intermediate",
      estimated_days: n.estimatedDays || n.estimated_days || 4,
      status: "not_started",
      resources: n.resources || [], 
      tasks: n.tasks || [],
      dependencies: n.dependencies || [] 
    }));

    const { error: nodesError } = await supabaseAdmin.from("skill_nodes").insert(nodeRows);
    if (nodesError) {
      console.error("❌ Supabase Skill Nodes Insert Error:", nodesError);
      return NextResponse.json({ error: "Failed to allocate target skill nodes", details: nodesError }, { status: 500 });
    }

    // Save Tasks to 'tasks' Table (Fixed user_id constraint)
    const taskRows: any[] = [];
    roadmapData.nodes.forEach((n: any) => {
      (n.tasks || []).forEach((t: any) => {
        taskRows.push({
          roadmap_id: roadmap.id,
          user_id: userId,
          title: t.title || t.name || "Task",
          description: t.description || "",
          status: t.completed ? "completed" : "todo",
          priority: "medium",
        });
      });
    });

    if (taskRows.length > 0) {
      const { error: tasksError } = await supabaseAdmin
        .from("tasks")
        .insert(taskRows);

      if (tasksError) {
        console.error("❌ Supabase child tasks insert error:", tasksError);
      }
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