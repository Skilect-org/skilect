"use client";

import { useState, useEffect } from "react";
import {
  ListChecks,
  Mic,
  Map,
  Flame,
  ArrowRight,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Target,
  Code2,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useDashboard, type DashboardStats } from "@/hooks/use-dashboard";
import { useTasks, type Task } from "@/hooks/use-tasks";
import { TaskDrawer, type DrawerFormData } from "@/app/(app)/tasks/page";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with real data from your backend               */
/* ------------------------------------------------------------------ */

const mockStats = {
  readinessScore: 11,
  totalTasks: 3,
  totalInterviews: 2,
  roadmapProgress: 1,
  streak: 4,
  readinessBreakdown: [
    { label: "Technical Skills", value: 15, color: "#3b82f6" },
    { label: "Resume Quality", value: 8, color: "#8b5cf6" },
    { label: "Interview Prep", value: 5, color: "#f59e0b" },
    { label: "Projects", value: 18, color: "#10b981" },
  ],
};

const mockRoadmaps = [
  {
    id: "1",
    title: "React & Next.js Mastery",
    progress: 35,
    totalSteps: 12,
    completedSteps: 4,
    icon: Code2,
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    progress: 20,
    totalSteps: 18,
    completedSteps: 3,
    icon: Brain,
    color: "#8b5cf6",
  },
  {
    id: "3",
    title: "System Design Fundamentals",
    progress: 10,
    totalSteps: 8,
    completedSteps: 1,
    icon: Target,
    color: "#f59e0b",
  },
];

const mockTasks = [
  {
    id: "1",
    title: "Complete Array Problems Set",
    category: "DSA",
    status: "in-progress" as const,
    dueTime: "2h left",
  },
  {
    id: "2",
    title: "Build Portfolio Landing Page",
    category: "Projects",
    status: "pending" as const,
    dueTime: "Today",
  },
  {
    id: "3",
    title: "Review React Hooks Notes",
    category: "Learning",
    status: "pending" as const,
    dueTime: "Today",
  },
  {
    id: "4",
    title: "Practice Behavioral Questions",
    category: "Interview",
    status: "completed" as const,
    dueTime: "Done",
  },
];

/* ------------------------------------------------------------------ */
/*  Circular progress ring                                             */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}%</span>
        <span className="text-[10px] font-medium text-gray-400">Ready</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ReadinessSection({
  score,
  breakdown,
  stats,
}: {
  score: number;
  breakdown: { label: string; value: number; color: string }[];
  stats: DashboardStats;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {/* Readiness card — spans 3 cols */}
      <div
        className="flex items-center gap-5 rounded-xl border border-gray-100 bg-white px-5 py-4 lg:col-span-3"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {/* Score ring */}
        <ScoreRing score={score} size={130} />

        {/* Breakdown */}
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Placement Readiness
          </p>
          <div className="mt-2.5 space-y-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-[88px] shrink-0 truncate text-[12px] font-medium text-gray-600">
                  {item.label}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="w-7 text-right text-[11px] font-semibold text-gray-500">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            Complete tasks and interviews to improve
          </p>
        </div>
      </div>

      {/* Stat cards — 2x2 grid in remaining 2 cols */}
      <div className="grid grid-cols-2 gap-3 lg:col-span-2">
        <QuickStatCard
          icon={ListChecks}
          label="Total Tasks"
          value={stats.totalTasks}
          color="#3b82f6"
          bgColor="#eff6ff"
        />
        <QuickStatCard
          icon={Mic}
          label="Interviews"
          value={stats.totalInterviews}
          color="#8b5cf6"
          bgColor="#f5f3ff"
        />
        <QuickStatCard
          icon={TrendingUp}
          label="Roadmaps"
          value={stats.roadmapCount}
          color="#f59e0b"
          bgColor="#fffbeb"
        />
        <QuickStatCard
          icon={Flame}
          label="Streak"
          value={`${stats.streak}d`}
          color="#ef4444"
          bgColor="#fef2f2"
        />
      </div>
    </div>
  );
}

function QuickStatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      className="group flex flex-col rounded-xl border border-gray-100 bg-white px-4 py-3.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={15} strokeWidth={1.75} style={{ color }} />
      </div>
      <p className="mt-2 text-lg font-bold tracking-tight text-gray-900">
        {value}
      </p>
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


function RoadmapListCard({
  roadmaps,
}: {
  roadmaps: typeof mockRoadmaps;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-gray-100 bg-white"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Map size={15} strokeWidth={1.75} className="text-gray-400" />
          <h3 className="text-[13px] font-semibold text-gray-900">
            Active Roadmaps
          </h3>
        </div>
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <Plus size={11} />
          New
        </Link>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-gray-50">
        {roadmaps.map((roadmap) => {
          const Icon = roadmap.icon;
          return (
            <Link
              key={roadmap.id}
              href="/roadmaps"
              className="group flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-gray-50/60"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${roadmap.color}14` }}
              >
                <Icon
                  size={15}
                  strokeWidth={1.75}
                  style={{ color: roadmap.color }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-gray-800 group-hover:text-gray-900">
                  {roadmap.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${roadmap.progress}%`,
                        backgroundColor: roadmap.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">
                    {roadmap.completedSteps}/{roadmap.totalSteps}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={13}
                className="shrink-0 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500"
              />
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 px-5 py-2.5">
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors hover:text-blue-600"
        >
          View all roadmaps
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

function TaskListCard({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
}) {
  const getCategoryLabel = (task: Task) => {
    if (task.roadmap_id) return "Roadmap";
    return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  };

  const getCategoryBadgeClass = (task: Task) => {
    if (task.roadmap_id) return "bg-violet-50 text-violet-600";
    if (task.priority === "high") return "bg-red-50 text-red-600";
    if (task.priority === "medium") return "bg-amber-50 text-amber-600";
    return "bg-gray-50 text-gray-500";
  };

  const getDueTimeLabel = (dueDateStr: string | null) => {
    if (!dueDateStr) return "No due date";
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    if (dueDate.toDateString() === today.toDateString()) return "Today";
    return dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const statusIcon = (status: Task["status"]) => {
    if (status === "completed") {
      return <CheckCircle2 size={15} strokeWidth={2} className="text-emerald-500 hover:scale-110 transition-transform" />;
    }
    if (status === "in_progress") {
      return <Clock size={15} strokeWidth={2} className="text-blue-500 hover:scale-110 transition-transform" />;
    }
    return <Circle size={15} strokeWidth={1.75} className="text-gray-300 hover:text-gray-400 hover:scale-110 transition-transform" />;
  };

  const displayedTasks = tasks.slice(0, 4);

  return (
    <div
      className="flex flex-col rounded-2xl border border-gray-100 bg-white"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <ListChecks size={15} strokeWidth={1.75} className="text-gray-400" />
          <h3 className="text-[13px] font-semibold text-gray-900">
            Today&apos;s Tasks
          </h3>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <Plus size={11} />
          New
        </Link>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-gray-50">
        {displayedTasks.length > 0 ? (
          displayedTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50/60"
            >
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await onToggle(task.id);
                }}
                className="shrink-0 focus:outline-none cursor-pointer"
              >
                {statusIcon(task.status)}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[13px] font-medium ${
                    task.status === "completed"
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(task)}`}
                  >
                    {getCategoryLabel(task)}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-medium text-gray-400">
                {getDueTimeLabel(task.due_date)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-[12px] font-medium text-gray-400">No tasks for today</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 px-5 py-2.5">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors hover:text-blue-600"
        >
          View all tasks
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboard();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, refetch: refetchTasks } = useTasks();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Listen for topbar "New Task" button event
  useEffect(() => {
    const handler = () => { setDrawerOpen(true); };
    window.addEventListener("open-new-task-drawer", handler);
    return () => window.removeEventListener("open-new-task-drawer", handler);
  }, []);

  const handleDrawerSubmit = async (data: DrawerFormData) => {
    try {
      await createTask({
        title: data.name,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
      setDrawerOpen(false);
      // Refresh both stats and tasks list
      await Promise.all([refetchStats(), refetchTasks()]);
    } catch (err) {
      console.error("Error creating task:", err);
      alert(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus: Task["status"] =
      task.status === "todo"
        ? "in_progress"
        : task.status === "in_progress"
        ? "completed"
        : "todo";
    
    try {
      await updateTask(id, { status: nextStatus });
      // Refresh stats card to reflect updated completions
      await refetchStats();
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

  // Readiness breakdown derived from real score
  const activeTasks = Math.max(stats.totalTasks - stats.completedTasks, 0);
  const roadmapProgress = stats.roadmapCount;
  const taskCompletionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;
  const breakdown = [
    {
      label: "Tasks Done",
      value: Math.min(Math.max(taskCompletionRate, 0), 100),
      color: "#3b82f6",
    },
    { label: "Roadmaps", value: Math.min(roadmapProgress * 20, 100), color: "#f59e0b" },
    { label: "Active", value: Math.min(activeTasks * 15, 100), color: "#10b981" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-4 lg:px-6 lg:py-5">
      {/* ── Readiness + Stats ─────────────────────────────────────── */}
      <ReadinessSection
        score={stats.readinessScore}
        breakdown={breakdown}
        stats={stats}
      />

      {/* ── Active Roadmaps + Today's Tasks ───────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RoadmapListCard roadmaps={mockRoadmaps} />
        <TaskListCard tasks={tasks} onToggle={handleToggleTask} />
      </div>

      <TaskDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
        editingTask={null}
        saving={false}
      />
    </div>
  );
}
