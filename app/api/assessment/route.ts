import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGemini25FlashLite } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";

const ASSESSMENT_CATALOG = [
  {
    id: "onboarding-diagnostic",
    title: "Technical & Career Evaluation",
    description: "Evaluates your engineering baseline, tech stack familiarity, and project background.",
    questionCount: 3, 
    duration: "5 min",
    difficulty: "adaptive" as const,
    category: "onboarding",
  }
];

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

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerSupabaseClient();
  const { data: existing } = await db
    .from("roadmaps")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true);

  const hasActiveRoadmap = existing && existing.length > 0;

  const assessments = ASSESSMENT_CATALOG.map((a) => ({
    ...a,
    status: hasActiveRoadmap ? ("completed" as const) : ("available" as const),
    score: hasActiveRoadmap ? 100 : undefined,
    savedFeedback: null,
  }));

  return NextResponse.json({ assessments });
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  let body;
  try {
    body = SubmitSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload schema match", details: error }, { status: 400 });
  }

  const db = createServerSupabaseClient();

  // 1. Sync User profile structure to prevent foreign key errors
  await db.from("users").upsert({
    id: userId,
    email: user.emailAddresses[0]?.emailAddress || "user@example.com",
    full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    updated_at: new Date().toISOString()
  });

  // 2. Generate metrics or build dynamic fallbacks
  const baseScore = body.experienceLevel === "advanced" ? 80 : body.experienceLevel === "intermediate" ? 60 : 40;
  const projectBonus = Math.min(parseInt(body.background.projectsBuilt || "0") * 5, 20);
  const dynamicScore = Math.min(baseScore + projectBonus, 100);
  const calculatedFeedback = `Accelerated learning pipeline optimized for target focus: ${body.background.learningGoal}`;

  // 3. Commit into the new assessment_results table
  const { error: assessmentError } = await db.from("assessment_results").upsert({
    user_id: userId,
    assessment_id: body.assessmentId,
    score: dynamicScore,
    feedback: calculatedFeedback,
    answers: body, // Complete dynamic payload snapshot saved to JSONB
    completed_at: new Date().toISOString()
  }, { onConflict: "user_id,assessment_id" });

  if (assessmentError) {
    return NextResponse.json({ error: "Failed to persist diagnostic score metrics" }, { status: 500 });
  }

  // 4. Initialize core Roadmap Entry point matching your structural flow
  const { data: roadmapRecord, error: roadmapError } = await db
    .from("roadmaps")
    .insert({
      user_id: userId,
      title: `Personalized ${body.targetRole} Path`,
      target_role: body.targetRole,
      is_active: true,
      description: calculatedFeedback,
      estimated_weeks: 8,
    })
    .select()
    .single();

  if (roadmapError) {
    return NextResponse.json({ error: "Failed to initialize learning pathway model" }, { status: 500 });
  }

  return NextResponse.json({
    readinessScore: dynamicScore,
    feedback: calculatedFeedback,
    roadmapId: roadmapRecord.id
  });
}