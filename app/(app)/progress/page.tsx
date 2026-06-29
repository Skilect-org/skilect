"use client";

import { Target, TrendingUp, Award, Clock, CheckSquare, Mic, Map, Flame } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";

/* ── ReadinessHero — real data ─────────────────────────────────────── */
function ReadinessHero({ score, targetRole, streak }: {
  score: number; targetRole: string; streak: number;
}) {
  const level = score >= 80 ? "Advanced" : score >= 55 ? "Intermediate" : "Beginner";
  const readinessLabel =
    score >= 80 ? "Interview Ready" : score >= 55 ? "Getting There" : "Early Stage";
  const filledBars = Math.round((score / 100) * 4);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl opacity-60" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col">
          <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Placement Readiness Score
          </h2>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {score}<span className="text-4xl text-blue-400">%</span>
            </span>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
              <TrendingUp size={12} /> {streak > 0 ? `${streak}d streak` : "Start your streak!"}
            </div>
          </div>
          <p className="mt-3 text-[14px] text-gray-600 max-w-sm leading-relaxed">
            {score >= 80
              ? `You are highly competitive for <strong>${targetRole || "Software Engineer"}</strong> roles.`
              : score >= 55
              ? `You are making good progress toward <strong>${targetRole || "your target role"}</strong>.`
              : `Keep building skills to become ready for <strong>${targetRole || "your target role"}</strong>.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Award size={14} className="text-amber-500" />
              <span className="text-[11px] font-medium uppercase">Level</span>
            </div>
            <span className="text-[15px] font-bold text-gray-900">{level}</span>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Target size={14} className="text-blue-500" />
              <span className="text-[11px] font-medium uppercase">Target</span>
            </div>
            <span className="text-[15px] font-bold text-gray-900 truncate">{targetRole || "Not set"}</span>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4 col-span-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock size={14} className="text-emerald-500" />
              <span className="text-[11px] font-medium uppercase">Readiness</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">{readinessLabel}</span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-2 w-8 rounded-full ${i < filledBars ? "bg-emerald-500" : "bg-gray-200"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── StatsCards — real data ────────────────────────────────────────── */
function StatsCards({ totalTasks, completedTasks, streak, roadmapCount }: {
  totalTasks: number; completedTasks: number; streak: number; roadmapCount: number;
}) {
  const stats = [
    { label: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, trend: `${totalTasks - completedTasks} remaining`, icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Interviews", value: "–", trend: "Complete an interview", icon: Mic, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Roadmaps", value: roadmapCount, trend: roadmapCount > 0 ? "Active" : "Generate one", icon: Map, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Current Streak", value: `${streak} Days`, trend: streak > 0 ? "Keep it up!" : "Start today", icon: Flame, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon size={18} className={stat.color} />
              </div>
            </div>
            <h3 className="text-[13px] font-medium text-gray-500">{stat.label}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-gray-400">{stat.trend}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function ProgressPage() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 px-5 py-4 lg:px-8 lg:py-6 animate-pulse">
        <div className="h-48 rounded-2xl bg-gray-100" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-gray-100" />)}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">Failed to load progress data. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-4 lg:px-8 lg:py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Progress</h1>
        <p className="mt-1 text-[13px] text-gray-500">Track your placement readiness over time.</p>
      </div>

      <ReadinessHero
        score={stats.readinessScore}
        targetRole="Software Engineer"
        streak={stats.streak}
      />

      <StatsCards
        totalTasks={stats.totalTasks}
        completedTasks={stats.completedTasks}
        streak={stats.streak}
        roadmapCount={stats.roadmapCount}
      />
    </div>
  );
}
