"use client";

import { useState, useEffect } from "react";

interface Strength {
  skill: string;
  level: number;
  description: string;
}

interface StrengthsCardProps {
  strengths: Strength[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <svg
            className="w-4.5 h-4.5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Strengths</h3>
          <p className="text-[11px] text-gray-400">
            {strengths.length} skills identified
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {strengths.map((s, idx) => (
          <div key={s.skill} className="group">
            <div className="flex items-start gap-3">
              {/* Checkmark */}
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{s.skill}</p>
                  <span className="text-xs font-bold text-emerald-600 tabular-nums">
                    {s.level}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {s.description}
                </p>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    style={{
                      width: animated ? `${s.level}%` : "0%",
                      transition: `width 1s ease-out ${300 + idx * 150}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
