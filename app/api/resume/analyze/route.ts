/**
 * POST /api/resume/analyze
 *
 * Pipeline:
 *   1. Receive multipart/form-data with `resume` (PDF) + `targetRole` (string)
 *   2. Extract raw text from the PDF buffer
 *   3. Send to Gemini Flash for structured skill-gap analysis
 *   4. Persist result to Supabase `resumes` table
 *   5. Return the analysis JSON
 *
 * Auth: Clerk  |  DB: Supabase (service-role)  |  AI: Gemini Flash
 *
 * Request  — FormData: { resume: File (PDF), targetRole: string }
 * Response — { resumeId, analysis: ResumeAnalysis }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Zod schema for Gemini's JSON response ─────────────────────────────────────
const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  skillsExtracted: z.array(z.string()),
  suggestions: z.array(
    z.object({
      section: z.string(),
      issue: z.string(),
      recommendation: z.string(),
      priority: z.enum(["low", "medium", "high"]),
    })
  ),
});

// ── Gemini prompt ──────────────────────────────────────────────────────────────
function buildPrompt(resumeText: string, targetRole: string): string {
  return `
You are an expert technical recruiter and career coach.

Analyze the resume below for a candidate targeting the role: "${targetRole}".

Return ONLY a valid JSON object (no markdown, no explanation) with this exact shape:
{
  "overallScore": <number 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "skillsExtracted": [<string>, ...],
  "suggestions": [
    {
      "section": "<resume section>",
      "issue": "<what is wrong>",
      "recommendation": "<how to fix it>",
      "priority": "low" | "medium" | "high"
    }
  ]
}

RESUME TEXT:
---
${resumeText}
---
`.trim();
}

export async function POST(request: NextRequest) {
  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Parse multipart form ────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("resume") as File | null;
  const targetRole = formData.get("targetRole") as string | null;

  if (!file || file.size === 0) {
    return NextResponse.json(
      { error: "Missing resume file" },
      { status: 400 }
    );
  }
  if (!targetRole?.trim()) {
    return NextResponse.json(
      { error: "Missing targetRole" },
      { status: 400 }
    );
  }

  // ── 3. Extract text from PDF ───────────────────────────────────────────────
  // We send the raw bytes to Gemini as a document part — Gemini 2.0 Flash
  // supports inline PDF reading natively (no external PDF parser needed).
  const pdfBytes = await file.arrayBuffer();
  const base64Pdf = Buffer.from(pdfBytes).toString("base64");

  // ── 4. Gemini analysis ─────────────────────────────────────────────────────
  let analysisRaw: string;
  try {
    const model = getGeminiFlashModel();
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },
      { text: buildPrompt("(See the attached PDF)", targetRole.trim()) },
    ]);
    analysisRaw = result.response.text().trim();
  } catch (error) {
    console.error("[/api/resume/analyze] Gemini error:", error);
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 502 }
    );
  }

  // ── 5. Parse & validate Gemini response ───────────────────────────────────
  let analysis;
  try {
    // Strip markdown fences if model adds them
    const clean = analysisRaw.replace(/```json|```/g, "").trim();
    analysis = ResumeAnalysisSchema.parse(JSON.parse(clean));
  } catch (error) {
    console.error("[/api/resume/analyze] Parse error:", error, analysisRaw);
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 }
    );
  }

  // ── 6. Persist to Supabase ─────────────────────────────────────────────────
  const db = createServerSupabaseClient();
  const { data: resume, error: dbError } = await db
    .from("resumes")
    .insert({
      user_id: userId,
      file_name: file.name,
      target_role: targetRole.trim(),
      analysis,
      uploaded_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("[/api/resume/analyze] DB error:", dbError);
    // Non-fatal — still return the analysis even if persist fails
  }

  return NextResponse.json({
    resumeId: resume?.id ?? null,
    analysis,
  });
}
