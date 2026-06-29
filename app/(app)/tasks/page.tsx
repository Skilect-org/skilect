"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, CheckCircle2, Circle, Clock, Calendar, Pencil, Trash2, X,
  Sparkles, Map, Flag, ChevronRight, Target,
} from "lucide-react";
import { useTasks, type Task, type TaskPriority } from "@/hooks/use-tasks";

/* ── Types ─────────────────────────────────────────────────────────── */
type TaskSource = "ai-generated" | "roadmap" | "custom";
type FilterTab = "all" | "in_progress" | "todo" | "completed";

interface DrawerFormData {
  name: string;
  priority: TaskPriority;
  dueDate: string;
  description: string;
}

const emptyForm: DrawerFormData = {
  name: "",
  priority: "medium",
  dueDate: "",
  description: "",
};

/* ── Config maps ────────────────────────────────────────────────────── */
const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All Tasks" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const priorityConfig: Record<
  TaskPriority,
  { label: string; bg: string; text: string; dot: string }
> = {
  high: { label: "High Priority", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  medium: { label: "Medium Priority", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  low: { label: "Low Priority", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

// Map roadmap_id presence to a source badge
function getSource(task: Task): TaskSource {
  if (task.roadmap_id) return "roadmap";
  if (task.description?.startsWith("From interview feedback")) return "ai-generated";
  return "custom";
}

const sourceConfig: Record<
  TaskSource,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  "ai-generated": { label: "AI Generated", bg: "bg-violet-50", text: "text-violet-600", icon: Sparkles },
  roadmap: { label: "Roadmap", bg: "bg-blue-50", text: "text-blue-600", icon: Map },
  custom: { label: "Custom", bg: "bg-emerald-50", text: "text-emerald-600", icon: Flag },
};

function formatDate(iso: string | null) {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/* ── Progress Section ───────────────────────────────────────────────── */
function ProgressSection({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-6 py-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Target size={17} strokeWidth={1.75} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900">Overall Progress</h3>
            <p className="mt-0.5 text-[11px] text-gray-400">Keep going — you&apos;re making great progress!</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {completed} <span className="font-normal text-gray-400">/ {total}</span>
          </p>
          <p className="text-[11px] text-gray-400">Tasks Completed</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-right text-[11px] font-medium text-gray-400">{pct}% complete</p>
    </div>
  );
}

/* ── Task Card ─────────────────────────────────────────────────────── */
function TaskCard({ task, onToggle, onEdit, onDelete }: {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  const priority = priorityConfig[task.priority];
  const source = sourceConfig[getSource(task)];
  const SourceIcon = source.icon;
  const isCompleted = task.status === "completed";

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
      className={`group rounded-xl border bg-white hover:-translate-y-0.5 hover:shadow-md
        ${isCompleted ? "border-gray-100 opacity-75" : "border-gray-100 hover:border-gray-200"}`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          {/* Toggle button — cycles todo → in_progress → completed */}
          <button onClick={() => onToggle(task.id)}
            className="mt-0.5 shrink-0 transition-transform duration-150 hover:scale-110">
            {isCompleted ? (
              <CheckCircle2 size={20} strokeWidth={2} className="text-emerald-500" />
            ) : task.status === "in_progress" ? (
              <Clock size={20} strokeWidth={2} className="text-blue-500" />
            ) : (
              <Circle size={20} strokeWidth={1.5} className="text-gray-300 transition-colors group-hover:text-gray-400" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className={`text-[14px] font-medium leading-snug
              ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 text-[12px] text-gray-500 line-clamp-1">{task.description}</p>
            )}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold
                ${task.status === "completed" ? "bg-emerald-50 text-emerald-600"
                  : task.status === "in_progress" ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-500"}`}>
                {task.status === "in_progress" ? "In Progress" : task.status === "completed" ? "Completed" : "To Do"}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${priority.bg} ${priority.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${source.bg} ${source.text}`}>
                <SourceIcon size={10} strokeWidth={2} />
                {source.label}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar size={12} strokeWidth={1.75} />
            <span>Due {formatDate(task.due_date)}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button onClick={() => onEdit(task)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <Pencil size={13} strokeWidth={1.75} />
            </button>
            <button onClick={() => onDelete(task.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Task Drawer ────────────────────────────────────────────────────── */
function TaskDrawer({ isOpen, onClose, onSubmit, editingTask, saving }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DrawerFormData) => Promise<void>;
  editingTask: Task | null;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<DrawerFormData>(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.title,
        priority: editingTask.priority,
        dueDate: editingTask.due_date ? editingTask.due_date.split("T")[0] : "",
        description: editingTask.description,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>
                <p className="mt-0.5 text-[12px] text-gray-400">
                  {editingTask ? "Update the task details." : "Add a new task to your plan."}
                </p>
              </div>
              <button onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Task Name</label>
                  <input type="text" placeholder="e.g., Complete React Hooks Project"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "medium", "high"] as TaskPriority[]).map((p) => {
                      const cfg = priorityConfig[p];
                      const isActive = formData.priority === p;
                      return (
                        <button key={p} type="button"
                          onClick={() => setFormData({ ...formData, priority: p })}
                          className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all
                            ${isActive ? `${cfg.bg} ${cfg.text} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Due Date</label>
                  <input type="date" value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-[13px] text-gray-900 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-gray-700">Description</label>
                  <textarea rows={4} placeholder="Describe what needs to be done..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="resize-none rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>

              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
                <button type="submit" disabled={saving || !formData.name.trim()}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:pointer-events-none">
                  {saving ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}
                </button>
                <button type="button" onClick={onClose}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50">
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

/* ── Empty State ────────────────────────────────────────────────────── */
function EmptyState({ filter }: { filter: FilterTab }) {
  const messages: Record<FilterTab, { title: string; subtitle: string }> = {
    all: { title: "No tasks yet", subtitle: "Create your first task to start preparing." },
    todo: { title: "No to-do tasks", subtitle: "Everything is in progress or done!" },
    in_progress: { title: "Nothing in progress", subtitle: "Pick a task and get started." },
    completed: { title: "No completed tasks yet", subtitle: "Complete your first task to see it here." },
  };
  const msg = messages[filter];
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Clock size={20} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <p className="mt-3 text-[14px] font-medium text-gray-600">{msg.title}</p>
      <p className="mt-1 text-[12px] text-gray-400">{msg.subtitle}</p>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function TasksPage() {
  const { tasks, loading, error, saving, counts, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Listen for topbar "New Task" button event
  useEffect(() => {
    const handler = () => { setEditingTask(null); setDrawerOpen(true); };
    window.addEventListener("open-new-task-drawer", handler);
    return () => window.removeEventListener("open-new-task-drawer", handler);
  }, []);

  const filterCounts: Record<FilterTab, number> = {
    all: counts.total,
    todo: counts.todo,
    in_progress: counts.in_progress,
    completed: counts.completed,
  };

  const filteredTasks = tasks.filter((t) =>
    activeFilter === "all" ? true : t.status === activeFilter
  );

  const handleDrawerSubmit = async (data: DrawerFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: data.name,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        });
      } else {
        await createTask({
          title: data.name,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        });
      }
      setDrawerOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
      alert(err instanceof Error ? err.message : "Failed to save task");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-5 px-5 py-4 lg:px-6 lg:py-5 animate-pulse">
        <div className="h-7 w-24 rounded-lg bg-gray-100" />
        <div className="h-24 rounded-xl bg-gray-100" />
        <div className="flex gap-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 w-24 rounded-full bg-gray-100" />)}</div>
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-100" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-4 lg:px-6 lg:py-5">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="mt-1 text-[13px] text-gray-400">
            Track and complete your placement preparation tasks.
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setDrawerOpen(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700">
          <Plus size={15} /> New Task
        </button>
      </div>

      <ProgressSection completed={counts.completed} total={counts.total} />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all
                ${isActive ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}>
              {tab.label}
              <span className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold
                ${isActive ? "bg-white/20 text-white" : "bg-white text-gray-500"}`}>
                {filterCounts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task}
                onToggle={toggleTask}
                onEdit={(t) => { setEditingTask(t); setDrawerOpen(true); }}
                onDelete={deleteTask} />
            ))
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}>
              <EmptyState filter={activeFilter} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingTask(null); }}
        onSubmit={handleDrawerSubmit}
        editingTask={editingTask}
        saving={saving} />
    </div>
  );
}
