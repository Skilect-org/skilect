"use client";

import { useState, useEffect } from "react";

interface ScoreCardProps {
  score: number;
  label: string;
}

export function ScoreCard({ score, label }: ScoreCardProps) {
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - score / 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animated) return;

    const duration = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [animated, score]);

  /* colour palette based on score */
  const palette =
    score >= 80
      ? {
          from: "#10b981",
          to: "#14b8a6",
          text: "text-emerald-600",
          glow: "shadow-emerald-400/20",
        }
      : score >= 60
        ? {
            from: "#3b82f6",
            to: "#06b6d4",
            text: "text-blue-600",
            glow: "shadow-blue-400/20",
          }
        : score >= 40
          ? {
              from: "#f59e0b",
              to: "#f97316",
              text: "text-amber-600",
              glow: "shadow-amber-400/20",
            }
          : {
              from: "#ef4444",
              to: "#ec4899",
              text: "text-red-600",
              glow: "shadow-red-400/20",
            };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center ${palette.glow}`}
    >
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
        Readiness Score
      </h3>

      {/* SVG circular gauge */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width={200} height={200} className="transform -rotate-90">
            <defs>
              <linearGradient
                id="scoreGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={palette.from} />
                <stop offset="100%" stopColor={palette.to} />
              </linearGradient>
            </defs>

            {/* Track */}
            <circle
              cx={100}
              cy={100}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Progress */}
            <circle
              cx={100}
              cy={100}
              r={radius}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: animated ? targetOffset : circumference,
                transition:
                  "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </svg>

          {/* Score in centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tracking-tight ${palette.text}`}>
              {displayScore}
              <span className="text-2xl font-semibold">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="mt-6 text-sm font-medium text-gray-500">{label}</p>

      {/* Legend */}
      <div className="mt-5 flex justify-center gap-4 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
          0–40
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          40–70
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          70–100
        </span>
      </div>
    </div>
  );
}
