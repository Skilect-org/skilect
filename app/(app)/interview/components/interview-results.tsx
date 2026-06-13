"use client";

import { CheckCircle2, TrendingUp, Sparkles, Map, ListChecks, RotateCcw, MessageSquare, Code2, AlertCircle } from "lucide-react";
import { MOCK_RESULTS } from "../types";

interface InterviewResultsProps {
  onRetake: () => void;
}

export function InterviewResults({ onRetake }: InterviewResultsProps) {
  const results = MOCK_RESULTS;

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-8 max-w-6xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interview Completed</h1>
        <p className="mt-2 text-[15px] text-gray-500 max-w-xl">
          Great job! AI has analyzed your performance across technical knowledge and communication skills.
        </p>
      </div>

      {/* Top Scores Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-blue-50">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-blue-600"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * results.overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-4xl font-bold text-gray-900">{results.overallScore}</span>
          </div>
          <h2 className="mt-6 text-[15px] font-semibold text-gray-900">Overall Score</h2>
          <p className="mt-1 text-[13px] text-gray-500">Strong Candidate</p>
        </div>

        {/* Category Scores */}
        <div className="flex flex-col justify-center gap-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-2">Category Performance</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {results.categories.map((cat) => (
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
        {/* Left Col: Analysis */}
        <div className="flex flex-col gap-6">
          {/* AI Feedback */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-blue-900">
              <Sparkles size={16} className="text-blue-600" />
              AI Feedback
            </h3>
            <p className="text-[13px] leading-relaxed text-blue-800/90">
              {results.feedback}
            </p>
          </div>

          {/* Communication Analysis */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
              <MessageSquare size={16} className="text-violet-500" />
              Communication Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-medium text-gray-500 mb-1.5">Filler Words Used</p>
                <div className="flex flex-wrap gap-2">
                  {results.communicationAnalysis.fillerWords.map(w => (
                    <span key={w} className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200/50">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[11px] text-gray-500">Speaking Pace</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{results.communicationAnalysis.pace}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500">Clarity</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{results.communicationAnalysis.clarity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Analysis */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
              <Code2 size={16} className="text-emerald-500" />
              Technical Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-medium text-gray-500 mb-2">Strong Areas</p>
                <div className="flex flex-wrap gap-2">
                  {results.technicalAnalysis.strongAreas.map(w => (
                    <span key={w} className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-medium text-gray-500 mb-2">Needs Improvement</p>
                <div className="flex flex-wrap gap-2">
                  {results.technicalAnalysis.weakAreas.map(w => (
                    <span key={w} className="rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Question Review & Action Items */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          {/* Question Review */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-50 px-6 py-5">
              <h3 className="text-[15px] font-semibold text-gray-900">Question Review</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {results.questionReviews.map((review, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[14px] font-medium text-gray-900 leading-snug">
                      Q{i + 1}. {review.question}
                    </h4>
                    <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-700">
                      {review.score}%
                    </span>
                  </div>
                  
                  <div className="mt-3 rounded-xl bg-gray-50 p-4">
                    <p className="text-[13px] text-gray-600 font-medium">Your Answer:</p>
                    <p className="mt-1 text-[13px] text-gray-500 leading-relaxed font-mono bg-white p-2 rounded-lg border border-gray-100">
                      "{review.userAnswer}"
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[12px] font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                        <TrendingUp size={14} /> Strengths
                      </p>
                      <ul className="space-y-1.5">
                        {review.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[12px] text-gray-600">
                            <span className="text-emerald-500 mt-0.5">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                        <AlertCircle size={14} /> Weaknesses
                      </p>
                      <ul className="space-y-1.5">
                        {review.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[12px] text-gray-600">
                            <span className="text-amber-500 mt-0.5">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 hover:border-blue-200 active:scale-[0.98]">
                <Map size={20} className="text-blue-500" />
                <span className="text-[13px] font-medium text-gray-700">Generate Roadmap</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-900 p-4 transition-all hover:bg-gray-800 active:scale-[0.98]">
                <ListChecks size={20} className="text-violet-400" />
                <span className="text-[13px] font-medium text-white">Improvement Tasks</span>
              </button>
              <button 
                onClick={onRetake}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50 active:scale-[0.98]"
              >
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
