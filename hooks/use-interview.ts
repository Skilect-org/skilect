"use client";

import { useCallback, useMemo, useState } from "react";

export interface SessionEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  transcript: string;
  modelAnswer?: string;
}

export interface SessionResult {
  questionId: string;
  question: string;
  evaluation: SessionEvaluation;
}

function buildEvaluation(question: string, answer: string, audioFallback = false): SessionEvaluation {
  const trimmed = answer.trim();
  const baseScore = Math.min(Math.max(trimmed.length, 45), 95);
  const score = audioFallback ? Math.max(baseScore - 10, 50) : baseScore;

  return {
    score,
    strengths: [
      "Clear structure",
      "Relevant examples",
      "Good confidence",
    ].slice(0, 2),
    improvements: [
      "Add more specific detail",
      "Reduce filler language",
      "Explain trade-offs",
    ].slice(0, 2),
    feedback: trimmed
      ? "Your response was concise and mostly on topic. Focus on adding more concrete examples to increase clarity."
      : "No answer was recorded, so the AI could not generate a detailed evaluation.",
    transcript: audioFallback ? "Recorded answer not available, fallback text used." : answer,
    modelAnswer: question.includes("React")
      ? "React Hooks let you use state and lifecycle features without classes. They simplify logic reuse and improve readability."
      : undefined,
  };
}

export function useInterview() {
  const [results, setResults] = useState<SessionResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitTextAnswer = useCallback(
    async (questionId: string, question: string, answer: string) => {
      setSubmitting(true);
      setError(null);

      try {
        const evaluation = buildEvaluation(question, answer);
        setResults((prev) => {
          const filtered = prev.filter((item) => item.questionId !== questionId);
          return [...filtered, { questionId, question, evaluation }];
        });
      } catch (err) {
        setError("Failed to evaluate answer. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const submitAudioAnswer = useCallback(
    async (questionId: string, question: string, audioBlob: Blob | null) => {
      setSubmitting(true);
      setError(null);

      try {
        const transcript = audioBlob
          ? "Transcribed audio answer."
          : "No audio available.";
        const evaluation = buildEvaluation(question, transcript, !audioBlob);
        setResults((prev) => {
          const filtered = prev.filter((item) => item.questionId !== questionId);
          return [...filtered, { questionId, question, evaluation }];
        });
      } catch (err) {
        setError("Failed to process audio. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setSubmitting(false);
  }, []);

  const aggregateScore = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, result) => sum + result.evaluation.score, 0) / results.length
    );
  }, [results]);

  return {
    results,
    aggregateScore,
    reset,
    submitTextAnswer,
    submitAudioAnswer,
    submitting,
    error,
  };
}
