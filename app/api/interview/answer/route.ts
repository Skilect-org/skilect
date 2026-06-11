/**
 * POST /api/interview/answer
 *
 * Pipeline:
 *   1. Receive multipart/form-data: { audio: File, question: string, sessionId?: string }
 *   2. Send audio to Sarvam AI STT → get transcript
 *   3. Send transcript + question to Gemini Flash → get evaluation + feedback
 *   4. Send feedback text to Sarvam AI TTS → get audio response
 *   5. Persist Q&A to Supabase interview_sessions table
 *   6. Return { transcript, evaluation, feedbackAudio (base64) }
 *
 * Auth: Clerk  |  DB: Supabase  |  AI: Sarvam STT/TTS + Gemini Flash
 *
 * Request  — FormData: { audio: File (wav/mp3/webm), question: string, sessionId?: string }
 * Response — { transcript, score, feedback, feedbackAudio }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { sarvamFetch } from "@/lib/sarvam";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Gemini response schema ─────────────────────────────────────────────────────
const EvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  modelAnswer: z.string(),
});

// ── Gemini prompt ──────────────────────────────────────────────────────────────
function buildEvalPrompt(question: string, transcript: string): string {
  return `
You are an expert technical interviewer evaluating a candidate's answer.

Interview Question: "${question}"

Candidate's Answer (transcribed): "${transcript}"

Evaluate the answer and return ONLY a valid JSON object (no markdown):
{
  "score": <0-100>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", ...],
  "improvements": ["<improvement 1>", ...],
  "modelAnswer": "<ideal concise answer>"
}
`.trim();
}

export async function POST(request: NextRequest) {
  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Parse form data ─────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const audioFile = formData.get("audio") as File | null;
  const question = formData.get("question") as string | null;
  const sessionId = formData.get("sessionId") as string | null;

  if (!audioFile || audioFile.size === 0) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }
  if (!question?.trim()) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  // ── 3. Sarvam STT — audio → transcript ────────────────────────────────────
  let transcript: string;
  try {
    const sttForm = new FormData();
    sttForm.append("file", audioFile);
    sttForm.append("model", "saarika:v2");
    sttForm.append("language_code", "en-IN");

    const sttResponse = await sarvamFetch("/speech-to-text", {
      method: "POST",
      body: sttForm,
    });

    if (!sttResponse.ok) {
      const errText = await sttResponse.text();
      throw new Error(`Sarvam STT error: ${errText}`);
    }

    const sttData = await sttResponse.json();
    transcript = sttData.transcript ?? sttData.text ?? "";

    if (!transcript) throw new Error("Empty transcript from Sarvam STT");
  } catch (error) {
    console.error("[/api/interview/answer] STT error:", error);
    return NextResponse.json(
      { error: "Speech-to-text failed" },
      { status: 502 }
    );
  }

  // ── 4. Gemini — evaluate the answer ───────────────────────────────────────
  let evaluation;
  try {
    const model = getGeminiFlashModel();
    const result = await model.generateContent(
      buildEvalPrompt(question.trim(), transcript)
    );
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    evaluation = EvaluationSchema.parse(JSON.parse(raw));
  } catch (error) {
    console.error("[/api/interview/answer] Gemini eval error:", error);
    return NextResponse.json(
      { error: "Answer evaluation failed" },
      { status: 502 }
    );
  }

  // ── 5. Sarvam TTS — feedback text → audio ─────────────────────────────────
  let feedbackAudio: string | null = null;
  try {
    const ttsResponse = await sarvamFetch("/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        inputs: [evaluation.feedback],
        target_language_code: "en-IN",
        speaker: "meera",
        model: "bulbul:v1",
      }),
    });

    if (ttsResponse.ok) {
      const ttsData = await ttsResponse.json();
      // Sarvam returns base64-encoded audio in audios[0]
      feedbackAudio = ttsData.audios?.[0] ?? null;
    }
  } catch (error) {
    // TTS is non-fatal — text feedback still works
    console.warn("[/api/interview/answer] TTS error:", error);
  }

  // ── 6. Persist to Supabase ─────────────────────────────────────────────────
  const db = createServerSupabaseClient();

  // Upsert the interview session
  const now = new Date().toISOString();

  if (sessionId) {
    // Append Q&A to existing session
    await db.from("interview_answers").insert({
      session_id: sessionId,
      user_id: userId,
      question: question.trim(),
      transcript,
      score: evaluation.score,
      feedback: evaluation.feedback,
      model_answer: evaluation.modelAnswer,
      created_at: now,
    });
  } else {
    // Create a new session + first answer
    const { data: session } = await db
      .from("interview_sessions")
      .insert({
        user_id: userId,
        status: "in_progress",
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (session) {
      await db.from("interview_answers").insert({
        session_id: session.id,
        user_id: userId,
        question: question.trim(),
        transcript,
        score: evaluation.score,
        feedback: evaluation.feedback,
        model_answer: evaluation.modelAnswer,
        created_at: now,
      });
    }
  }

  return NextResponse.json({
    transcript,
    score: evaluation.score,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    modelAnswer: evaluation.modelAnswer,
    feedbackAudio, // base64 WAV — null if TTS failed
  });
}
