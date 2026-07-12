import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGemini25FlashLite, getGemini25Flash } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";

const RequestSchema = z.object({
  targetRole: z.string().optional(),
  skillGaps: z.array(z.string()).optional(),
});

async function generateWithFailover(prompt: string) {
  const config = {
    responseMimeType: "application/json",
    temperature: 0.1,
    maxOutputTokens: 8192,
  };

  try {
    const model = getGemini25FlashLite();
    return await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: config,
    });
  } catch (primaryError) {
    console.warn("⚠️ Primary Model failed, scaling to secondary fallback...", primaryError);
    const backupModel = getGemini25Flash();
    return await backupModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: config,
    });
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
  if (normalized.includes("ml") || normalized.includes("ai")) return REQUIRED_SKILLS_BY_ROLE["ml-ai"];
  if (normalized.includes("datascience") || normalized.includes("data")) return REQUIRED_SKILLS_BY_ROLE["data-science"];
  if (normalized.includes("devops") || normalized.includes("cloud")) return REQUIRED_SKILLS_BY_ROLE.devops;
  if (normalized.includes("mobile") || normalized.includes("ios") || normalized.includes("android")) return REQUIRED_SKILLS_BY_ROLE.mobile;
  if (normalized.includes("security") || normalized.includes("cyber")) return REQUIRED_SKILLS_BY_ROLE.cybersecurity;
  
  return REQUIRED_SKILLS_BY_ROLE.fullstack;
}

function buildPrompt(targetRole: string, skillGaps: string[]): string {
  return `
You are an expert technical curriculum designer.
Generate a comprehensive preparation roadmap for a student targeting the role: "${targetRole}".
The student needs to bridge these specific skill gaps: ${skillGaps.join(", ")}.

CRITICAL INSTRUCTIONS: 
1. Output ONLY a valid raw JSON object. Do not wrap it in markdown blocks.
2. Limit the roadmap to a MAXIMUM of 5 skill nodes.
3. Every node MUST contain an array of 3 actionable tasks.

Structure exactly like this:
{
  "title": "Roadmap Title",
  "description": "Short summary",
  "estimatedWeeks": 8,
  "nodes": [
    {
      "name": "Skill Name",
      "description": "What to learn",
      "level": "beginner", 
      "estimatedDays": 4,
      "resources": [],
      "tasks": [
        { "id": "t1", "title": "Task 1", "completed": false }
      ]
    }
  ]
}`.trim();
}

function getBulletproofFallback(role: string, gaps: string[]) {
  const fallbackSkills = gaps && gaps.length > 0 ? gaps.slice(0, 5) : getRequiredSkills(role).slice(0, 5);
  
  return {
    title: `${role} Essentials Roadmap`,
    description: `An auto-generated baseline curriculum to kickstart your progress based on your target role.`,
    estimatedWeeks: fallbackSkills.length * 2,
    nodes: fallbackSkills.map((skill, index) => ({
      name: skill,
      description: `Master the fundamental concepts, syntax, and best practices for ${skill}.`,
      level: index === 0 ? "beginner" : "intermediate",
      estimatedDays: 7,
      resources: [],
      tasks: [
        { id: crypto.randomUUID(), title: `Read official documentation and setup environment for ${skill}`, completed: false },
        { id: crypto.randomUUID(), title: `Build a foundational mini-project utilizing ${skill}`, completed: false },
        { id: crypto.randomUUID(), title: `Complete standard algorithm/logic exercises using ${skill}`, completed: false }
      ]
    }))
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseToken = await getToken({ template: "supabase" });
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
    );
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const jsonBody = await request.json().catch(() => ({}));
    const { targetRole, skillGaps } = RequestSchema.parse(jsonBody);

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id, target_role, skills")
      .eq("clerk_id", userId)
      .single();

    const finalTargetRole = targetRole || existingUser?.target_role || "Full Stack Developer";
    let finalSkillGaps = skillGaps || [];

    if (finalSkillGaps.length === 0) {
      const userSkills: string[] = existingUser?.skills || [];
      const required = getRequiredSkills(finalTargetRole);
      const lowerUserSkills = new Set(userSkills.map(s => s.toLowerCase()));
      finalSkillGaps = required.filter(s => !lowerUserSkills.has(s.toLowerCase()));
      if (finalSkillGaps.length === 0) finalSkillGaps = required;
    }

    // 1. Check for existing roadmaps safely
    const { data: existingRoadmaps } = await supabase
      .from("roadmaps")
      .select("*, skill_nodes(*)") 
      .eq("user_id", userId)
      .eq("target_role", finalTargetRole)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (existingRoadmaps && existingRoadmaps.length > 0 && existingRoadmaps[0].skill_nodes?.length > 0) {
      const existingRoadmap = existingRoadmaps[0];
      if (existingRoadmap.skill_nodes) {
        existingRoadmap.skill_nodes.sort((a: any, b: any) => (a.step_index || 0) - (b.step_index || 0));
      }
      // ⚠️ Kept commented out during verification
      // return NextResponse.json({ roadmap: existingRoadmap }, { status: 200 });
    }

    let roadmapData;
    try {
      const prompt = buildPrompt(finalTargetRole, finalSkillGaps);
      const result = await generateWithFailover(prompt);
      const rawText = result.response.text();
      
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found in AI response.");

      const parsedData = JSON.parse(jsonMatch[0]);
      const extractedNodes = parsedData.nodes || parsedData.skillNodes || parsedData.skill_nodes || parsedData.skills || [];

      if (!Array.isArray(extractedNodes) || extractedNodes.length < 2) {
         throw new Error("AI generated too few nodes. Triggering fallback.");
      }
      
      const hasValidTasks = extractedNodes.some((node: any) => node.tasks && Array.isArray(node.tasks) && node.tasks.length > 0);
      if (!hasValidTasks) {
         throw new Error("AI generated nodes without tasks. Triggering fallback.");
      }

      roadmapData = {
        title: parsedData.title || `${finalTargetRole} Preparation Path`,
        description: parsedData.description || `Custom curriculum focusing on bridging your skills gaps.`,
        estimatedWeeks: parsedData.estimatedWeeks || parsedData.estimated_weeks || 8,
        nodes: extractedNodes
      };

    } catch (error) {
      console.warn("🚨 AI Generation failed validation. Forcing hardcoded assessment fallback...", error);
      roadmapData = getBulletproofFallback(finalTargetRole, finalSkillGaps);
    }

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
      return NextResponse.json({ error: "Failed to allocate roadmap parent" }, { status: 500 });
    }

    const skillNodeRows = (roadmapData.nodes || []).map((node: any, index: number) => ({
      roadmap_id: roadmap.id, 
      user_id: userId, 
      name: node.name || "Unknown Skill", 
      description: node.description || "Foundational learning.",
      level: ["beginner", "intermediate", "advanced"].includes(node.level) ? node.level : "beginner",
      estimated_days: typeof (node.estimatedDays || node.estimated_days) === "number" ? (node.estimatedDays || node.estimated_days) : 4,
      status: index === 0 ? "in_progress" : "not_started", 
      resources: node.resources || [],
      dependencies: node.dependencies || [],
      step_index: index, 
      tasks: (node.tasks || []).map((task: any) => ({
        id: task.id || crypto.randomUUID(),
        title: task.title || task.name || "Complete task",
        description: task.description || "",
        status: task.completed ? "completed" : "todo"
      }))
    }));

    if (skillNodeRows.length > 0) {
      const { error: nodesError } = await supabaseAdmin
        .from("skill_nodes")
        .insert(skillNodeRows);

      if (nodesError) {
        console.error("❌ Supabase Skill Nodes Insert Error:", nodesError);
        await supabaseAdmin.from("roadmaps").delete().eq("id", roadmap.id);
        return NextResponse.json({ error: "Failed to allocate target skill nodes" }, { status: 500 });
      }
    }

    // ⚡ FIX 1: Refetch using supabaseAdmin to guarantee data visibility instantly across RLS policies
    const { data: completeRoadmap, error: refetchError } = await supabaseAdmin
      .from("roadmaps")
      .select("*, skill_nodes(*)")
      .eq("id", roadmap.id)
      .single();

    if (refetchError) {
      console.error("❌ Supabase Refetch Final Roadmap Error:", refetchError);
    } else if (completeRoadmap && completeRoadmap.skill_nodes) {
      completeRoadmap.skill_nodes.sort((a: any, b: any) => (a.step_index || 0) - (b.step_index || 0));
    }

    // ⚡ FIX 2: Send explicit cache-control response headers to tell Next.js not to save stale empty layouts
    return NextResponse.json(
      { roadmap: completeRoadmap }, 
      { 
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
  } catch (error) {
    console.error("Critical Execution Fault:", error);
    return NextResponse.json({ error: "Server Processing Error" }, { status: 500 });
  }
}