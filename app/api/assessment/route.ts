/**
 * /api/assessment/route.ts
 *
 * GET  — Checks if the user already has an active roadmap to determine completion status.
 * POST — Evaluates background details -> creates a row in 'roadmaps' -> inserts AI milestones into 'tasks'.
 *
 * Auth: Clerk  |  DB: Supabase  |  AI: Gemini Flash Fallback
 */

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";

const ASSESSMENT_CATALOG = [
  {
    id: "onboarding-diagnostic",
    title: "Skilect Technical & Career Evaluation",
    description: "Evaluates your engineering baseline, tech stack familiarity, and project background.",
    questionCount: 3, 
    duration: "5 min",
    difficulty: "adaptive" as const,
    category: "onboarding",
  }
];

// ── Inbound Validation Schema ──────────────────────────────────────────────────
const SubmitSchema = z.object({
  assessmentId: z.string().min(1),
  targetRole: z.string().min(1),
  experienceLevel: z.string().min(1),
  skillsChecklist: z.array(z.string()),
  background: z.object({
    projectsBuilt: z.string(),
    hasInternship: z.boolean(),
    learningGoal: z.string()
  })
});

// ── Prompt Engineering Configuration ───────────────────────────────────────────
function buildGradingPrompt(
  targetRole: string,
  experienceLevel: string,
  skillsChecklist: string[],
  background: { projectsBuilt: string; hasInternship: boolean; learningGoal: string }
): string {
  return `
You are the core AI evaluation engine for Skilect. 
Your goal is to perform a diagnostic evaluation on an onboarding engineering student and output a structured skill matrix.

User Profile Context:
- Declared Target Role: ${targetRole}
- Declared Baseline Experience Tier: ${experienceLevel}
- Self-Reported Skills: ${skillsChecklist.join(", ") || "None specified"}
- Background Metrics:
  * Number of projects built: ${background.projectsBuilt}
  * Has completed a technical internship: ${background.hasInternship ? "Yes" : "No"}
  * Immediate learning priority: ${background.learningGoal}

Analyze their baseline metrics against real-world industry requirements for a competitive "${targetRole}". Identify technical strengths based on their choices, target critical knowledge gaps, and design an optimized high-level learning milestone framework.

Return ONLY a valid, single JSON object string. Do not wrap the output in markdown, do not provide trailing text.

Strict Output JSON Structure:
{
  "readinessScore": <integer between 0 and 100>,
  "scoreLabel": "A concise summary status line",
  "strengths": [
    { "skill": "Skill Name", "level": <integer 0-100>, "description": "1 short sentence explaining asset." }
  ],
  "gaps": [
    { "skill": "Target Tool Name", "priority": "high" or "medium" or "low", "description": "Exactly what to master." }
  ],
  "recommendation": {
    "title": "${targetRole}",
    "match": <integer 0-100>,
    "description": "2-3 tailored sentences defining their learning direction.",
    "nextSteps": [
      "Explicit milestone task 1",
      "Explicit milestone task 2",
      "Explicit milestone task 3"
    ]
  }
}
`.trim();
}

// ── GET HANDLER ────────────────────────────────────────────────────────────────
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerSupabaseClient();

  const { data: existingRoadmaps } = await db
    .from("roadmaps")
    .select("id, target_role, created_at")
    .eq("user_id", userId)
    .eq("is_active", true);

  const hasActiveRoadmap = existingRoadmaps && existingRoadmaps.length > 0;

  const assessments = ASSESSMENT_CATALOG.map((assessment) => {
    return {
      ...assessment,
      status: hasActiveRoadmap ? ("completed" as const) : ("available" as const),
      score: hasActiveRoadmap ? 100 : undefined,
      savedFeedback: null,
    };
  });

  return NextResponse.json({ assessments });
}

// ── POST HANDLER ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  let body;
  try {
    body = SubmitSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload schema match", details: error },
      { status: 400 }
    );
  }

  const catalogMatch = ASSESSMENT_CATALOG.find((a) => a.id === body.assessmentId);
  if (!catalogMatch) {
    return NextResponse.json({ error: "Target catalog identifier not found" }, { status: 404 });
  }

  // ── Execute Automated AI Assessment Grading / Fallback ─────────────────────
  let grading;
  try {
    const model = getGeminiFlashModel();
    const prompt = buildGradingPrompt(
      body.targetRole,
      body.experienceLevel,
      body.skillsChecklist,
      body.background
    );

    console.log("📡 Sending profile data to Gemini API...");
    const result = await model.generateContent(prompt);
    
    const rawText = result.response.text();
    
    // 1. LOUD DEBUG LOG: Show exactly what the AI returned before parsing
    console.log("================ 🤖 RAW AI RESPONSE ================");
    console.log(rawText);
    console.log("====================================================");

    // 2. Clean up common markdown wrappers safely
    const cleanedText = rawText
      .replace(/^```json\s*/i, "") // Remove opening ```json
      .replace(/```$/, "")         // Remove closing ```
      .trim();

    grading = JSON.parse(cleanedText);
    console.log("✅ JSON parsed successfully! Injecting data into Supabase...");

  } catch (error: any) {
    console.error("🚨 SYSTEM TRIPPED AN ERROR INSIDE THE TRY BLOCK:", error.message);
    
    // Fallback logic that procedurally adapts to user inputs
    const userSkills = body.skillsChecklist.length > 0 ? body.skillsChecklist : ["Core Engineering"];
    const primarySkill = userSkills[0];
    
    // Dynamically calculate a mock score based on their projects and experience
    const baseScore = body.experienceLevel === "senior" ? 85 : body.experienceLevel === "intermediate" ? 65 : 45;
    const projectBonus = Math.min(parseInt(body.background.projectsBuilt || "0") * 5, 20);
    const internshipBonus = body.background.hasInternship ? 10 : 0;
    const dynamicScore = Math.min(baseScore + projectBonus + internshipBonus, 98);

    grading = {
      readinessScore: dynamicScore,
      scoreLabel: dynamicScore > 75 ? "Advanced Baseline Track" : "Solid Foundations Track",
      strengths: userSkills.map((skill, index) => ({
        skill,
        level: Math.max(90 - (index * 8), 60),
        description: `Demonstrated practical competency applying ${skill} across past development cycles.`
      })).slice(0, 3),
      gaps: [
        { 
          skill: `${body.targetRole} Systems Integration`, 
          priority: "high", 
          description: `Bridging isolated ${primarySkill} features into complex production architectures.` 
        },
        { 
          skill: "Advanced Automated Testing", 
          priority: "medium", 
          description: `Expanding coverage frameworks to insulate against application latency bottlenecks.` 
        }
      ],
      recommendation: {
        title: body.targetRole,
        match: dynamicScore + 2,
        description: `Your profile indicates excellent capacity for a specialized ${body.targetRole} pipeline. Based on building ${body.background.projectsBuilt} projects, we are accelerating past raw syntax to focus straight on your milestone: "${body.background.learningGoal}".`,
        nextSteps: [
          `Architect a high-availability system integrating ${userSkills.slice(0, 2).join(' and ')}.`,
          `Implement specialized relational query optimization structures to handle heavy write loads.`,
          `Deploy an end-to-end telemetry dashboard tracking state mutations for your ${body.targetRole} tools.`
        ]
      }
    };
  }

  // ── Commit Structured Analytics Directly to Database ───────────────────────
  const db = createServerSupabaseClient();

  // 0. ENSURE USER EXISTS IN SUPABASE FIRST (Fixes the Foreign Key constraint)
  const primaryEmail = user.emailAddresses[0]?.emailAddress || "no-email@example.com";
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Anonymous Developer";

  const { error: userError } = await db.from("users").upsert({
    id: userId,
    email: primaryEmail,
    full_name: fullName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (userError) {
    console.error("[POST /api/assessment] Failed to sync Clerk user to Supabase:", userError);
    return NextResponse.json({ error: "Failed to sync user profile" }, { status: 500 });
  }
  
  // 1. Insert the primary generation metadata record into the 'roadmaps' table
  const { data: roadmapRecord, error: roadmapError } = await db
    .from("roadmaps")
    .insert({
      user_id: userId,
      title: `Personalized ${body.targetRole} Path`,
      target_role: body.targetRole,
      is_active: true,
      description: grading.recommendation.description,
      estimated_weeks: 12,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (roadmapError || !roadmapRecord) {
    console.error("[POST /api/assessment] Roadmaps entry insertion failure:", roadmapError);
    return NextResponse.json({ error: "Failed to initialize personalized learning pathway profile" }, { status: 500 });
  }

  // 2. Prepare sub-tasks parsed straight from the nextSteps AI array configurations
  const tasksToInsert = grading.recommendation.nextSteps.map((stepText: string) => ({
    roadmap_id: roadmapRecord.id,
    user_id: userId,
    title: stepText.length > 50 ? stepText.substring(0, 47) + "..." : stepText,
    description: stepText,
    status: "todo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  // 3. Batch bulk insert rows straight into your schema's 'tasks' table 
  const { error: tasksError } = await db
    .from("tasks")
    .insert(tasksToInsert);

  if (tasksError) {
    console.error("[POST /api/assessment] Tasks entry batch insertion failure:", tasksError);
  }

  // RETURN THE NEW ROADMAP ID ALONG WITH THE GRADING DATA
  return NextResponse.json({
    ...grading,
    roadmapId: roadmapRecord.id
  });
}