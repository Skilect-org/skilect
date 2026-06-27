// app/api/assessment/onboarding/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getGeminiFlashModel, roadmapResponseSchema } from "@/lib/gemini";

// ── 1. VALIDATION SCHEMA ─────────────────────────────────────────────────────
const OnboardingSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  college: z.string().min(1),
  branch: z.string().min(1),
  yearOfStudy: z.string().min(1),
  targetRole: z.string().min(1),
  skills: z.array(z.string()),
  experienceLevel: z.string().min(1),
  projectCount: z.string().min(1),
  hasInternship: z.boolean(),
});

// ── 2. FALLBACK SKILLS PER ROLE ──────────────────────────────────────────────
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

// ── 3. SYSTEM PROMPT CONSTRUCT ──────────────────────────────────────────────
function buildPrompt(targetRole: string, orderedSkills: string[]): string {
  return `
You are an expert technical curriculum designer.
Generate a comprehensive, structural preparation roadmap for a student targeting the role: "${targetRole}".

The student needs to bridge these specific skill gaps (ordered by priority): ${orderedSkills.join(", ")}.

CRITICAL: You must output ONLY a valid, raw JSON object. Do NOT wrap it in markdown code blocks (no \`\`\`json blocks), and provide no pre-text or post-text explanation.

The JSON response must precisely follow this structure:
{
  "title": "String - Title of the roadmap",
  "description": "String - High level summary statement",
  "estimatedWeeks": 8,
  "nodes": [
    {
      "name": "String - Specific Skill Name",
      "description": "String - What the student needs to learn and focus on",
      "level": "beginner" | "intermediate" | "advanced", 
      "estimatedDays": number,
      "resources": [
        {
          "title": "String - Resource Name",
          "url": "String - Valid reference URL",
          "type": "article" | "video" | "course" | "documentation"
        }
      ],
      "tasks": [
        {
          "id": "String - e.g. t1, t2",
          "title": "String - Task Title",
          "completed": false
        }
      ]
    }
  ]
}

Note: Valid values for 'level' are: "beginner" | "intermediate" | "advanced".
Valid values for resource 'type' are: "article" | "video" | "course" | "documentation".
Provide 2-3 realistic resource references per node.
`.trim();
}

// ── 4. POST ENDPOINT HANDLER ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = OnboardingSchema.parse(await request.json());

    // A. Parse and process name fields
    const parts = body.fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    // B. Serialize nested JSON structures
    const educationJson = JSON.stringify({
      college: body.college,
      branch: body.branch,
      yearOfStudy: body.yearOfStudy,
    });

    const experienceJson = JSON.stringify({
      experienceLevel: body.experienceLevel,
      projectCount: body.projectCount,
      hasInternship: body.hasInternship,
    });

    const db = createServerSupabaseClient();

    // C. Upsert the User record
    const { data: userRecord, error: userError } = await db
      .from("users")
      .upsert({
        clerk_id: userId,
        email: body.email,
        first_name: firstName,
        last_name: lastName,
        target_role: body.targetRole,
        skills: body.skills,
        education: educationJson,
        experience: experienceJson,
        assessment_completed: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "clerk_id"
      })
      .select()
      .single();

    if (userError) {
      console.error("[/api/assessment/onboarding] Supabase user upsert error:", userError);
      return NextResponse.json({ error: "Failed to persist user profile details" }, { status: 500 });
    }

    // D. Calculate Skill Gaps for the Roadmap Generation
    const required = getRequiredSkills(body.targetRole);
    const lowerUserSkills = new Set(body.skills.map(s => s.toLowerCase()));
    let skillGaps = required.filter(s => !lowerUserSkills.has(s.toLowerCase()));
    if (skillGaps.length === 0) {
      skillGaps = required;
    }

    // E. Generate the Roadmap details using Gemini Flash
    let roadmapData;
    try {
      const model = getGeminiFlashModel();
      const prompt = buildPrompt(body.targetRole, skillGaps);
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { 
          responseMimeType: "application/json",
          responseSchema: roadmapResponseSchema as any
        },
      });
      
      const responseText = result.response.text().trim();
      const cleanJsonString = responseText.replace(/^```json\s*|```$/gi, "").trim();
      roadmapData = JSON.parse(cleanJsonString);
    } catch (error) {
      console.warn("[/api/assessment/onboarding] Gemini roadmap call failed, deploying mock fallback:", error);
      roadmapData = {
        title: `${body.targetRole} Preparation Path`,
        description: `Custom curriculum focusing on bridging your skills gaps: ${skillGaps.slice(0, 3).join(", ")}.`,
        estimatedWeeks: 8,
        nodes: skillGaps.slice(0, 4).map((skill, index) => ({
          name: skill,
          description: `Master fundamental and practical concepts of ${skill} to qualify for target industry standards.`,
          level: index === 0 ? "beginner" : index < 3 ? "intermediate" : "advanced",
          estimatedDays: 5 + index * 2,
          resources: [
            {
              title: `${skill} Documentation`,
              url: "https://developer.mozilla.org/en-US/",
              type: "documentation"
            },
            {
              title: `Comprehensive ${skill} Course`,
              url: "https://youtube.com",
              type: "video"
            }
          ],
          tasks: [
            { id: `t-${index}-1`, title: `Learn core syntax and features of ${skill}`, completed: false },
            { id: `t-${index}-2`, title: `Build a mini practice application using ${skill}`, completed: false }
          ]
        }))
      };
    }

    // F. Save the Roadmap entity in the Database
    const { data: roadmap, error: roadmapError } = await db
      .from("roadmaps")
      .insert({
        user_id: userId,
        title: roadmapData.title,
        description: roadmapData.description,
        target_role: body.targetRole,
        estimated_weeks: roadmapData.estimatedWeeks || 8,
      })
      .select("id")
      .single();

    if (roadmapError || !roadmap) {
      console.error("[/api/assessment/onboarding] Supabase roadmap save error:", roadmapError);
      return NextResponse.json({ error: "Failed to persist roadmap entity" }, { status: 500 });
    }

    // G. Save Skill Nodes steps
    const skillNodeRows = (roadmapData.nodes || []).map((node: any, index: number) => ({
      roadmap_id: roadmap.id,
      user_id: userId,
      name: node.name,
      description: node.description,
      level: ["beginner", "intermediate", "advanced"].includes(node.level) ? node.level : "beginner",
      estimated_days: typeof (node.estimatedDays || node.estimated_days) === "number" ? (node.estimatedDays || node.estimated_days) : 5,
      status: index === 0 ? "in_progress" : "not_started",
      resources: node.resources || [],
      tasks: node.tasks || [],
      dependencies: node.dependencies || [],
    }));

    if (skillNodeRows.length > 0) {
      const { error: nodesError } = await db
        .from("skill_nodes")
        .insert(skillNodeRows);
      
      if (nodesError) {
        console.error("[/api/assessment/onboarding] Supabase skill nodes insert error:", nodesError);
      }
    }

    // H. Save Tasks (to support `/assessment/results` which displays nextSteps/tasks)
    const taskRows: any[] = [];
    (roadmapData.nodes || []).forEach((node: any) => {
      (node.tasks || []).forEach((task: any) => {
        taskRows.push({
          roadmap_id: roadmap.id,
          user_id: userId,
          title: task.title || task.name || "Task",
          description: task.description || "",
          status: task.completed ? "completed" : "todo",
          priority: "medium",
        });
      });
    });

    if (taskRows.length === 0) {
      (roadmapData.nodes || []).forEach((node: any, index: number) => {
        taskRows.push({
          roadmap_id: roadmap.id,
          user_id: userId,
          title: node.name,
          description: node.description,
          status: index === 0 ? "in_progress" : "todo",
          priority: index === 0 ? "high" : "medium",
        });
      });
    }

    if (taskRows.length > 0) {
      const { error: tasksError } = await db
        .from("tasks")
        .insert(taskRows);

      if (tasksError) {
        console.error("[/api/assessment/onboarding] Supabase tasks insert error:", tasksError);
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      user: userRecord,
      roadmapId: roadmap.id,
    }, { status: 201 });

  } catch (error) {
    console.error("[/api/assessment/onboarding] Server processing error:", error);
    return NextResponse.json({ error: "Internal Server Processing Error" }, { status: 500 });
  }
}
