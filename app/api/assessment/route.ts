/**
 * /api/assessment
 *
 * GET  — Fetch assessments for the user
 *         Returns available assessments + user's completed ones with scores
 *
 * POST — Submit assessment answers → Gemini grades them → save to Supabase
 *         Body: { assessmentId: string, answers: { questionId: string, answer: string }[] }
 *
 * Auth: Clerk  |  DB: Supabase  |  AI: Gemini Flash (for grading)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Static assessment catalog ──────────────────────────────────────────────────
// In production this would come from Supabase — seeded by Mayank
const ASSESSMENT_CATALOG = [
  {
    id: "dsa-fundamentals",
    title: "DSA Fundamentals",
    description: "Arrays, Linked Lists, Trees, Graphs, Sorting & Searching",
    questionCount: 15,
    duration: "30 min",
    difficulty: "beginner" as const,
    category: "technical",
  },
  {
    id: "system-design-basics",
    title: "System Design Basics",
    description: "Scalability, Load Balancing, Caching, Databases",
    questionCount: 10,
    duration: "25 min",
    difficulty: "intermediate" as const,
    category: "technical",
  },
  {
    id: "behavioral-star",
    title: "Behavioral (STAR Method)",
    description: "Leadership, Teamwork, Conflict Resolution, Problem Solving",
    questionCount: 8,
    duration: "20 min",
    difficulty: "beginner" as const,
    category: "behavioral",
  },
  {
    id: "advanced-algorithms",
    title: "Advanced Algorithms",
    description: "Dynamic Programming, Graph Algorithms, Complexity Analysis",
    questionCount: 12,
    duration: "40 min",
    difficulty: "advanced" as const,
    category: "technical",
  },
];

// ── Submit schema ──────────────────────────────────────────────────────────────
const SubmitSchema = z.object({
  assessmentId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

// ── Gemini grading prompt ─────────────────────────────────────────────────────
function buildGradingPrompt(
  assessmentTitle: string,
  answers: { questionId: string; answer: string }[]
): string {
  const answersText = answers
    .map((a, i) => `Q${i + 1} (${a.questionId}): ${a.answer}`)
    .join("\n");

  return `
You are an expert technical interviewer grading a "${assessmentTitle}" assessment.

Grade these answers and return ONLY valid JSON (no markdown):
{
  "overallScore": <0-100>,
  "feedback": "<2-3 sentence summary>",
  "questionScores": [
    { "questionId": "<id>", "score": <0-10>, "comment": "<brief feedback>" }
  ]
}

Answers submitted:
${answersText}
`.trim();
}

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerSupabaseClient();

  // Fetch user's completed assessments
  const { data: completedAssessments } = await db
    .from("assessment_results")
    .select("assessment_id, score, completed_at")
    .eq("user_id", userId);

  const completedMap = new Map(
    (completedAssessments ?? []).map((a) => [a.assessment_id, a])
  );

  // Merge catalog with user progress
  const assessments = ASSESSMENT_CATALOG.map((assessment) => {
    const completed = completedMap.get(assessment.id);
    return {
      ...assessment,
      status: completed ? ("completed" as const) : ("available" as const),
      score: completed?.score ?? undefined,
    };
  });

  return NextResponse.json({ assessments });
}

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = SubmitSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", details: error },
      { status: 400 }
    );
  }

  const assessment = ASSESSMENT_CATALOG.find(
    (a) => a.id === body.assessmentId
  );
  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  // ── Gemini grading ─────────────────────────────────────────────────────────
  let grading;
  try {
    const model = getGeminiFlashModel();
    const result = await model.generateContent(
      buildGradingPrompt(assessment.title, body.answers)
    );
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    grading = JSON.parse(raw);
  } catch (error) {
    console.error("[POST /api/assessment] Gemini error:", error);
    return NextResponse.json(
      { error: "Grading failed" },
      { status: 502 }
    );
  }

  // ── Persist result ─────────────────────────────────────────────────────────
  const db = createServerSupabaseClient();
  await db.from("assessment_results").upsert({
    user_id: userId,
    assessment_id: body.assessmentId,
    score: grading.overallScore,
    feedback: grading.feedback,
    answers: body.answers,
    completed_at: new Date().toISOString(),
  });

  return NextResponse.json({
    score: grading.overallScore,
    feedback: grading.feedback,
    questionScores: grading.questionScores ?? [],
  });
}
