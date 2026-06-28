/**
 * POST /api/interview/answer
 * 
 * Optimized Pipeline:
 * 1. Auth via Clerk
 * 2. Input Detection (Audio vs Text)
 * 3. Sarvam STT (if audio) -> Transcript
 * 4. Gemini Flash -> Technical Evaluation (Strict JSON)
 * 5. Sarvam TTS -> Audio Feedback (Non-blocking)
 * 6. Supabase -> Async Persistence
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getGeminiFlashModel } from "@/lib/gemini";
import { sarvamFetch } from "@/lib/sarvam";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Strict Schema for AI output ────────────────────────────────────────────
const EvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  modelAnswer: z.string(),
  technicalAccuracy: z.enum(["High", "Medium", "Low"]),
});

// ── Enhanced Prompt for higher accuracy ────────────────────────────────────
function buildEvalPrompt(question: string, transcript: string): string {
  return `
You are a Senior Technical Interviewer at a FAANG company. 
Evaluate the candidate's answer based on: Technical Correctness, Clarity, and Conciseness.

[CONTEXT]
Interview Question: "${question}"
Candidate's Answer: "${transcript}"

[STRICT REQUIREMENTS]
1. If the answer is technically wrong, the score must be below 50.
2. If the answer is "I don't know" or irrelevant, the score must be 0.
3. Provide a "modelAnswer" that is the gold standard for this specific question.

Return ONLY a valid JSON object:
{
  "score": <number>,
  "feedback": "<critique the logic, not just the tone>",
  "strengths": ["<specific technical point they got right>"],
  "improvements": ["<specific technical gap>"],
  "modelAnswer": "<the perfect concise answer>",
  "technicalAccuracy": "High" | "Medium" | "Low"
}
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Guard
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Parse FormData
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const question = formData.get("question") as string | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!audioFile || !question?.trim()) {
      return NextResponse.json({ error: "Missing audio/text file or question" }, { status: 400 });
    }

    // 3. Transcript Acquisition (Hybrid Mode)
    let transcript: string;
    const isTextFile = audioFile.type === "text/plain" || audioFile.name.endsWith(".txt");

    if (isTextFile) {
      transcript = await audioFile.text();
    } else {
      try {
        const sttForm = new FormData();
        sttForm.append("file", audioFile);
        sttForm.append("model", "saarika:v2");
        sttForm.append("language_code", "en-IN");

        const sttResponse = await sarvamFetch("/speech-to-text", {
          method: "POST",
          body: sttForm,
        });

        if (!sttResponse.ok) throw new Error("Sarvam STT API failed");
        
        const sttData = await sttResponse.json();
        transcript = sttData.transcript || sttData.text || "";
      } catch (err) {
        console.error("STT Error:", err);
        return NextResponse.json({ error: "Audio transcription failed" }, { status: 502 });
      }
    }

    if (!transcript.trim() || transcript.toLowerCase().includes("no audio recorded")) {
      return NextResponse.json({ error: "No valid answer detected" }, { status: 400 });
    }

    // 4. Gemini Evaluation
    let evaluation;
    try {
      const model = getGeminiFlashModel();
      const result = await model.generateContent(buildEvalPrompt(question.trim(), transcript));
      const rawJson = result.response.text().replace(/```json|```/g, "").trim();
      evaluation = EvaluationSchema.parse(JSON.parse(rawJson));
    } catch (err) {
      console.error("Gemini Error:", err);
      return NextResponse.json({ error: "Evaluation engine failed" }, { status: 502 });
    }

    // 5. Sarvam TTS (Feedback Audio) - Handled as non-blocking
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
        feedbackAudio = ttsData.audios?.[0] || null;
      }
    } catch (err) {
      console.warn("TTS failed, but continuing...", err);
    }

    // 6. Supabase Persistence (Async - don't let DB lag slow down the user)
    // We use a non-awaited promise or a separate try-block to ensure user gets result
    const db = createServerSupabaseClient();
    const now = new Date().toISOString();
    
    const persistData = async () => {
      try {
        if (sessionId) {
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
          const { data: session } = await db.from("interview_sessions")
            .insert({ user_id: userId, status: "in_progress", created_at: now })
            .select("id").single();
          
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
      } catch (dbErr) {
        console.error("DB Persistence Error:", dbErr);
      }
    };

    // Start DB write but don't "await" it if you want maximum speed
    persistData(); 

    return NextResponse.json({
      transcript,
      ...evaluation,
      feedbackAudio,
    });

  } catch (globalError) {
    console.error("Global API Error:", globalError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
