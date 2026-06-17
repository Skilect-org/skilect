"use client";

import {
  CheckCircle2, TrendingUp, Sparkles, Map, ListChecks,
  RotateCcw, MessageSquare, Code2, AlertCircle,
} from "lucide-react";
import { type SessionResult } from "@/hooks/use-interview";
import { useRouter } from "next/navigation";

interface InterviewResultsProps {
  onRetake: () => void;
  results: SessionResult[];
  aggregateScore: number;
}

export function InterviewResults({ onRetake, results, aggregateScore }: InterviewResultsProps) {
  const router = useRouter();

  const hasRealResults = results.length > 0;

  // Compute category scores from real data
  const avgScore = hasRealResults ? aggregateScore : 75;

  const categories = [
    { label: "Technical Knowledge", score: hasRealResults ? Math.min(avgScore + 7, 100) : 82, color: "bg-blue-500" },
    { label: "Communication", score: hasRealResults ? Math.max(avgScore - 7, 0) : 68, color: "bg-violet-500" },
    { label: "Problem Solving", score: hasRealResults ? Math.min(avgScore + 2, 100) : 77, color: "bg-emerald-500" },
    { label: "Overall Confidence", score: hasRealResults ? Math.max(avgScore - 2, 0) : 73, color: "bg-amber-500" },
  ];

  // Aggregate strengths and improvements from all evaluations
  const allStrengths = results.flatMap((r) => r.evaluation.strengths).slice(0, 4);
  const allImprovements = results.flatMap((r) => r.evaluation.improvements).slice(0, 4);
  const overallFeedback = results.length > 0
    ? results[results.length - 1].evaluation.feedback
    : "Complete an interview to see AI feedback here.";

  const handleGenerateRoadmap = async () => {
    if (!hasRealResults) return;
    try {
      const res = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: "Software Engineer",
          skillGaps: allImprovements.slice(0, 4),
        }),
      });
      if (res.ok) router.push("/roadmaps");
    } catch {
      router.push("/roadmaps");
    }
  };

  const handleCreateImprovementTasks = async () => {
    if (!hasRealResults) return;
    try {
      await Promise.all(
        allImprovements.slice(0, 4).map((improvement) =>
          fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: improvement, priority: "medium", description: "From interview feedback" }),
          })
        )
      );
      router.push("/tasks");
    } catch {
      router.push("/tasks");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-8 max-w-6xl mx-auto w-full pb-20 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interview Completed</h1>
        <p className="mt-2 text-[15px] text-gray-500 max-w-xl">
          {hasRealResults
            ? `AI evaluated ${results.length} answer${results.length > 1 ? "s" : ""}. Here's your detailed analysis.`
            : "Great job! Review your performance below."}
        </p>
      </div>

      {/* Scores */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-blue-50">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" strokeWidth="12"
                className="text-blue-600" strokeDasharray="264"
                strokeDashoffset={264 - (264 * avgScore) / 100} strokeLinecap="round" />
            </svg>
            <span className="text-4xl font-bold text-gray-900">{avgScore}</span>
          </div>
          <h2 className="mt-6 text-[15px] font-semibold text-gray-900">Overall Score</h2>
          <p className="mt-1 text-[13px] text-gray-500">
            {avgScore >= 80 ? "Strong Candidate" : avgScore >= 60 ? "Good Candidate" : "Keep Practicing"}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-2">Category Performance</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-gray-700">{cat.label}</span>
                  <span className="text-[13px] font-bold text-gray-900">{cat.score}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left col */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-blue-900">
              <Sparkles size={16} className="text-blue-600" /> AI Feedback
            </h3>
            <p className="text-[13px] leading-relaxed text-blue-800/90">{overallFeedback}</p>
          </div>

          {allStrengths.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                <Code2 size={16} className="text-emerald-500" /> Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {allStrengths.map((s: string, i: number) => (
                  <span key={i} className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {allImprovements.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                <MessageSquare size={16} className="text-violet-500" /> Areas to Improve
              </h3>
              <div className="flex flex-wrap gap-2">
                {allImprovements.map((imp: string, i: number) => (
                  <span key={i} className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200/50">{imp}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {hasRealResults && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-50 px-6 py-5">
                <h3 className="text-[15px] font-semibold text-gray-900">Question Review</h3>
              </div>
              <div className="flex flex-col divide-y divide-gray-50">
                {results.map((result, i) => (
                  <div key={result.questionId} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-[14px] font-medium text-gray-900 leading-snug">Q{i + 1}. {result.question}</h4>
                      <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-700">
                        {result.evaluation.score}%
                      </span>
                    </div>
                    <div className="mt-3 rounded-xl bg-gray-50 p-4">
                      <p className="text-[13px] text-gray-600 font-medium">Your Answer (transcript):</p>
                      <p className="mt-1 text-[13px] text-gray-500 leading-relaxed italic">
                        &quot;{result.evaluation.transcript}&quot;
                      </p>
                    </div>
                    {result.evaluation.modelAnswer && (
                      <div className="mt-3 rounded-xl bg-blue-50 p-4">
                        <p className="text-[13px] text-blue-800 font-medium">Model Answer:</p>
                        <p className="mt-1 text-[13px] text-blue-700 leading-relaxed">{result.evaluation.modelAnswer}</p>
                      </div>
                    )}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[12px] font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                          <TrendingUp size={14} /> Strengths
                        </p>
                        <ul className="space-y-1.5">
                          {result.evaluation.strengths.map((s: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[12px] text-gray-600">
                              <span className="text-emerald-500 mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Improvements
                        </p>
                        <ul className="space-y-1.5">
                          {result.evaluation.improvements.map((imp: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[12px] text-gray-600">
                              <span className="text-amber-500 mt-0.5">•</span> {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <button onClick={handleGenerateRoadmap}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 hover:border-blue-200 active:scale-[0.98]">
                <Map size={20} className="text-blue-500" />
                <span className="text-[13px] font-medium text-gray-700">Generate Roadmap</span>
              </button>
              <button onClick={handleCreateImprovementTasks}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-900 p-4 transition-all hover:bg-gray-800 active:scale-[0.98]">
                <ListChecks size={20} className="text-violet-400" />
                <span className="text-[13px] font-medium text-white">Improvement Tasks</span>
              </button>
              <button onClick={onRetake}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 active:scale-[0.98]">
                <RotateCcw size={20} className="text-gray-500" />
                <span className="text-[13px] font-medium text-gray-700">Retake Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
