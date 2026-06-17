"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Map,
  Flag,
  ChevronRight,
  Target,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TaskPriority = "high" | "medium" | "low";
type TaskSource = "ai-generated" | "roadmap" | "custom";
type FilterTab = "all" | "ai-generated" | "roadmap" | "custom" | "completed";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  source: TaskSource;
  priority: TaskPriority;
  dueDate: string;
  description?: string;
  roadmap?: string;
  phase?: string;
}

const initialTasks: Task[] = [];

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All Tasks" },
  { key: "ai-generated", label: "AI Generated" },
  { key: "roadmap", label: "Roadmap Tasks" },
  { key: "custom", label: "Custom Tasks" },
  { key: "completed", label: "Completed" },
];

/* ------------------------------------------------------------------ */
/*  Helper utilities                                                   */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; bg: string; text: string; dot: string }
> = {
  high: {
    label: "High Priority",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium Priority",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Priority",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};

const sourceConfig: Record<
  TaskSource,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  "ai-generated": {
    label: "AI Generated",
    bg: "bg-violet-50",
    text: "text-violet-600",
    icon: Sparkles,
  },
  roadmap: {
    label: "Roadmap",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: Map,
  },
  custom: {
    label: "Custom",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: Flag,
  },
};

/* ------------------------------------------------------------------ */
/*  Progress Section                                                   */
/* ------------------------------------------------------------------ */

function ProgressSection({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="rounded-xl border border-gray-100 bg-white px-6 py-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Target size={17} strokeWidth={1.75} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900">
              Today&apos;s Progress
            </h3>
            <p className="mt-0.5 text-[11px] text-gray-400">
              Keep going — you&apos;re making great progress!
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {completed}{" "}
            <span className="font-normal text-gray-400">/ {total}</span>
          </p>
          <p className="text-[11px] text-gray-400">Tasks Completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-right text-[11px] font-medium text-gray-400">
        {pct}% complete
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Tabs                                                        */
/* ------------------------------------------------------------------ */

function FilterTabs({
  active,
  onSelect,
  counts,
}: {
  active: FilterTab;
  onSelect: (tab: FilterTab) => void;
  counts: Record<FilterTab, number>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterTabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Task Card                                                          */
/* ------------------------------------------------------------------ */

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const priority = priorityConfig[task.priority];
  const source = sourceConfig[task.source];
  const SourceIcon = source.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group rounded-xl border bg-white hover:-translate-y-0.5 hover:shadow-md ${
        task.completed
          ? "border-gray-100 opacity-75"
          : "border-gray-100 hover:border-gray-200"
      }`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="px-5 py-4">
        {/* Top row: Checkbox + Title + Badges */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className="mt-0.5 shrink-0 transition-transform duration-150 hover:scale-110"
            aria-label={
              task.completed ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {task.completed ? (
              <CheckCircle2
                size={20}
                strokeWidth={2}
                className="text-emerald-500"
              />
            ) : (
              <Circle
                size={20}
                strokeWidth={1.5}
                className="text-gray-300 transition-colors group-hover:text-gray-400"
              />
            )}
          </button>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p
              className={`text-[14px] font-medium leading-snug ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </p>

            {/* Roadmap alignment */}
            {task.roadmap && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5">
                <Map size={12} strokeWidth={1.75} className="shrink-0 text-blue-500" />
                <span className="text-[11px] text-gray-500">
                  <span className="font-medium text-gray-700">
                    Roadmap:
                  </span>{" "}
                  {task.roadmap}
                </span>
                <ChevronRight size={10} className="text-gray-300" />
                <span className="text-[11px] text-gray-500">
                  <span className="font-medium text-gray-700">Phase:</span>{" "}
                  {task.phase}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {/* Source badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${source.bg} ${source.text}`}
              >
                <SourceIcon size={10} strokeWidth={2} />
                {source.label}
              </span>

              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${priority.bg} ${priority.text}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                />
                {priority.label}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Due date + Actions */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar size={12} strokeWidth={1.75} />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Edit task"
            >
              <Pencil size={13} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Delete task"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Task Drawer (Create + Edit)                                        */
/* ------------------------------------------------------------------ */

interface DrawerFormData {
  name: string;
  category: TaskSource;
  priority: TaskPriority;
  dueDate: string;
  description: string;
}

const emptyForm: DrawerFormData = {
  name: "",
  category: "custom",
  priority: "medium",
  dueDate: "",
  description: "",
};

function TaskDrawer({
  isOpen,
  onClose,
  onCreateTask,
  onUpdateTask,
  editingTask,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (data: DrawerFormData) => void;
  onUpdateTask: (id: string, data: DrawerFormData) => void;
  editingTask: Task | null;
}) {
  const isEditMode = editingTask !== null;

  const [formData, setFormData] = useState<DrawerFormData>(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.title,
        category: editingTask.source,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        description: editingTask.description ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isEditMode && editingTask) {
      onUpdateTask(editingTask.id, formData);
    } else {
      onCreateTask(formData);
    }
    setFormData(emptyForm);
    onClose();
  };

  const handleClose = () => {
    setFormData(emptyForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl"
          >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900">
              {isEditMode ? "Edit Task" : "Create Task"}
            </h2>
            <p className="mt-0.5 text-[12px] text-gray-400">
              {isEditMode
                ? "Update the details of your task."
                : "Add a new task to your preparation plan."}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close drawer"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Task Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-name"
                className="text-[13px] font-medium text-gray-700"
              >
                Task Name
              </label>
              <input
                id="task-name"
                type="text"
                placeholder="e.g., Complete React Hooks Project"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-category"
                className="text-[13px] font-medium text-gray-700"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="task-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as TaskSource,
                    })
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 pr-9 text-[13px] text-gray-900 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="custom">Custom Task</option>
                  <option value="roadmap">Roadmap Task</option>
                  <option value="ai-generated">AI Generated</option>
                </select>
                <ChevronRight
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as TaskPriority[]).map((p) => {
                  const config = priorityConfig[p];
                  const isActive = formData.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, priority: p })
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-150 ${
                        isActive
                          ? `${config.bg} ${config.text} border-current`
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-due-date"
                className="text-[13px] font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-description"
                className="text-[13px] font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                rows={4}
                placeholder="Describe what needs to be done..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1"
            >
              {isEditMode ? "Save Changes" : "Create Task"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ filter }: { filter: FilterTab }) {
  const messages: Record<FilterTab, { title: string; subtitle: string }> = {
    all: {
      title: "No tasks yet",
      subtitle: "Create your first task to start preparing.",
    },
    "ai-generated": {
      title: "No AI generated tasks",
      subtitle:
        "Complete an AI analysis to receive personalized task recommendations.",
    },
    roadmap: {
      title: "No roadmap tasks",
      subtitle: "Start a roadmap to get structured preparation tasks.",
    },
    custom: {
      title: "No custom tasks",
      subtitle: "Create a task to track your own preparation goals.",
    },
    completed: {
      title: "No completed tasks yet",
      subtitle: "Complete your first task to see it here.",
    },
  };

  const msg = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Clock size={20} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <p className="mt-3 text-[14px] font-medium text-gray-600">
        {msg.title}
      </p>
      <p className="mt-1 text-[12px] text-gray-400">{msg.subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const handleOpenDrawer = () => {
      setEditingTask(null);
      setDrawerOpen(true);
    };

    window.addEventListener("open-new-task-drawer", handleOpenDrawer);
    return () => {
      window.removeEventListener("open-new-task-drawer", handleOpenDrawer);
    };
  }, []);

  /* Derived data */
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const counts: Record<FilterTab, number> = {
    all: tasks.length,
    "ai-generated": tasks.filter((t) => t.source === "ai-generated").length,
    roadmap: tasks.filter((t) => t.source === "roadmap").length,
    custom: tasks.filter((t) => t.source === "custom").length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return task.source === activeFilter && !task.completed;
  });

  /* Handlers */
  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDrawerOpen(true);
  };

  const handleCreateTask = (data: DrawerFormData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.name,
      completed: false,
      source: data.category,
      priority: data.priority,
      dueDate: data.dueDate || new Date().toISOString().split("T")[0],
      description: data.description,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, data: DrawerFormData) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: data.name,
              source: data.category,
              priority: data.priority,
              dueDate: data.dueDate || t.dueDate,
              description: data.description,
            }
          : t
      )
    );
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-4 lg:px-6 lg:py-5">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Tasks
        </h1>
        <p className="mt-1 text-[13px] text-gray-400">
          Track and complete your placement preparation tasks.
        </p>
      </div>

      {/* ── Progress Section ─────────────────────────────────────── */}
      <ProgressSection completed={completedCount} total={totalCount} />

      {/* ── Filter Tabs ──────────────────────────────────────────── */}
      <FilterTabs
        active={activeFilter}
        onSelect={setActiveFilter}
        counts={counts}
      />

      {/* ── Task List ────────────────────────────────────────────── */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState filter={activeFilter} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Task Drawer (Create / Edit) ──────────────────────────── */}
      <TaskDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}
