"use client";

import { ListChecks, Mic, Map, Flame, ArrowRight, Plus, CheckCircle2, Circle, Clock, TrendingUp, Code2 } from "lucide-react";
import Link from "next/link";
import { useDashboard, type DashboardStats, type ActiveRoadmap } from "@/hooks/use-dashboard";
import { useTasks, type Task } from "@/hooks/use-tasks";

interface ExtendedTask extends Task {
  priority?: "low" | "medium" | "high" | string;
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3b82f6" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}%</span>
        <span className="text-[10px] font-medium text-gray-400">Ready</span>
      </div>
    </div>
  );
}

function ReadinessSection({ score, breakdown, stats }: { score: number; breakdown: { label: string; value: number; color: string }[]; stats: DashboardStats; }) {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      <div className="flex items-center gap-5 rounded-xl border border-gray-100 bg-white px-5 py-4 lg:col-span-3 shadow-sm">
        <ScoreRing score={score} size={130} />
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Placement Readiness</p>
          <div className="mt-2.5 space-y-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-[88px] shrink-0 truncate text-[12px] font-medium text-gray-600">{item.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
                <span className="w-7 text-right text-[11px] font-semibold text-gray-500">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:col-span-2">
        <QuickStatCard icon={ListChecks} label="Total Tasks" value={stats.totalTasks} color="#3b82f6" bgColor="#eff6ff" />
        <QuickStatCard icon={Mic} label="Interviews" value={stats.totalInterviews} color="#8b5cf6" bgColor="#f5f3ff" />
        <QuickStatCard icon={TrendingUp} label="Roadmaps" value={stats.roadmapCount} color="#f59e0b" bgColor="#fffbeb" />
        <QuickStatCard icon={Flame} label="Streak" value={`${stats.streak}d`} color="#ef4444" bgColor="#fef2f2" />
      </div>
    </div>
  );
}

function QuickStatCard({ icon: Icon, label, value, color, bgColor }: { icon: React.ElementType; label: string; value: string | number; color: string; bgColor: string; }) {
  return (
    <div className="group flex flex-col rounded-xl border border-gray-100 bg-white px-4 py-3.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: bgColor }}>
        <Icon size={15} strokeWidth={1.75} style={{ color }} />
      </div>
      <p className="mt-2 text-lg font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-gray-400">{label}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-4 lg:px-6 lg:py-5 animate-pulse">
      <div className="grid gap-3 lg:grid-cols-5">
        <div className="h-40 rounded-xl bg-gray-100 lg:col-span-3" />
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100" />)}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-gray-100" />
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

function RoadmapListCard({ roadmaps }: { roadmaps: ActiveRoadmap[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Map size={15} strokeWidth={1.75} className="text-gray-400" />
          <h3 className="text-[13px] font-semibold text-gray-900">Active Roadmaps</h3>
        </div>
        <Link href="/assessment" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <Plus size={11} /> New
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-gray-50">
        {roadmaps.length === 0 ? (
           <div className="py-8 text-center"><p className="text-xs text-gray-400">No active roadmaps found.</p></div>
        ) : (
          roadmaps.map((roadmap) => (
            <Link key={roadmap.id} href="/roadmaps" className="group flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-gray-50/60">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${roadmap.color}14` }}>
                <Code2 size={15} strokeWidth={1.75} style={{ color: roadmap.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-gray-800 group-hover:text-gray-900">{roadmap.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${roadmap.progress}%`, backgroundColor: roadmap.color }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{roadmap.completedSteps}/{roadmap.totalSteps}</span>
                </div>
              </div>
              <ArrowRight size={13} className="shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500" />
            </Link>
          ))
        )}
      </div>
      <div className="border-t border-gray-50 px-5 py-2.5">
        <Link href="/roadmaps" className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors hover:text-blue-600">
          View all roadmaps <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

function TaskListCard({ tasks, onToggle }: { tasks: ExtendedTask[]; onToggle: (id: string) => Promise<void>; }) {
  const getCategoryLabel = (task: ExtendedTask) => {
    if (task.roadmap_id) return "Roadmap";
    if (task.priority) return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    return "General";
  };
  
  const getCategoryBadgeClass = (task: ExtendedTask) => {
    if (task.roadmap_id) return "bg-violet-50 text-violet-600";
    if (task.priority === "high") return "bg-red-50 text-red-600";
    return "bg-gray-50 text-gray-500";
  };
  
  const statusIcon = (status: ExtendedTask["status"]) => {
    if (status === "completed") return <CheckCircle2 size={15} strokeWidth={2} className="text-emerald-500 hover:scale-110 transition-transform" />;
    if (status === "in_progress") return <Clock size={15} strokeWidth={2} className="text-blue-500 hover:scale-110 transition-transform" />;
    return <Circle size={15} strokeWidth={1.75} className="text-gray-300 hover:text-gray-400 hover:scale-110 transition-transform" />;
  };

  const displayedTasks = tasks.slice(0, 4);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <ListChecks size={15} strokeWidth={1.75} className="text-gray-400" />
          <h3 className="text-[13px] font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <Link href="/tasks" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <Plus size={11} /> New
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-gray-50">
        {displayedTasks.length > 0 ? (
          displayedTasks.map((task) => (
            <div key={task.id} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50/60">
              <button onClick={async (e) => { e.preventDefault(); await onToggle(task.id); }} className="shrink-0 focus:outline-none cursor-pointer">
                {statusIcon(task.status)}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[13px] font-medium ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                  {task.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(task)}`}>
                    {getCategoryLabel(task)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-[12px] font-medium text-gray-400">No tasks active</p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-50 px-5 py-2.5">
        <Link href="/tasks" className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors hover:text-blue-600">
          View all tasks <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboard();
  const { tasks, loading: tasksLoading, error: tasksError, updateTask, refetch: refetchTasks } = useTasks();

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus: Task["status"] = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "completed" : "todo";
    
    try {
      await updateTask(id, { status: nextStatus });
      await Promise.all([refetchStats(), refetchTasks()]);
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  if (statsLoading || tasksLoading) return <DashboardSkeleton />;

  if (statsError || tasksError || !stats) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">Failed to load dashboard. Please refresh.</p>
      </div>
    );
  }

  const taskCompletionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const breakdown = [
    { label: "Tasks Done", value: Math.min(Math.max(taskCompletionRate, 0), 100), color: "#3b82f6" },
    { label: "Roadmaps", value: Math.min(stats.roadmapCount * 20, 100), color: "#f59e0b" },
    { label: "Active", value: Math.min(stats.activeTasks * 15, 100), color: "#10b981" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-4 lg:px-6 lg:py-5">
      <ReadinessSection score={stats.readinessScore} breakdown={breakdown} stats={stats} />
      <div className="grid gap-4 lg:grid-cols-2">
        <RoadmapListCard roadmaps={stats.activeRoadmaps} />
        <TaskListCard tasks={tasks} onToggle={handleToggleTask} />
      </div>
    </div>
  );
}