"use client";

import { useState, useEffect, useCallback } from "react";

export interface Task {
  id: string;
  user_id: string;
  roadmap_id: string | null;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];

const initialMockTasks: Task[] = [
  {
    id: "mock-task-1",
    user_id: "mock-user",
    roadmap_id: null,
    title: "Complete DSA Array Problems",
    description: "Solve 15 essential Array & Hashing questions on LeetCode.",
    priority: "high",
    status: "in_progress",
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-task-2",
    user_id: "mock-user",
    roadmap_id: null,
    title: "Review React Performance Optimizations",
    description: "Study React.memo, useMemo, and useCallback hooks for interviews.",
    priority: "medium",
    status: "todo",
    due_date: new Date(Date.now() + 86400000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-task-3",
    user_id: "mock-user",
    roadmap_id: null,
    title: "Refactor Portfolio Projects",
    description: "Add responsive design and project detail pages to portfolio.",
    priority: "low",
    status: "todo",
    due_date: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-task-4",
    user_id: "mock-user",
    roadmap_id: null,
    title: "Resume Review Session",
    description: "Review system design experience description and projects on resume.",
    priority: "high",
    status: "completed",
    due_date: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Fetch (Simulated) ────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate small delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      setTasks(initialMockTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Create ───────────────────────────────────────────────────────────────────
  const createTask = async (payload: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
    roadmapId?: string;
  }) => {
    setSaving(true);
    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        user_id: "mock-user",
        roadmap_id: payload.roadmapId ?? null,
        title: payload.title,
        description: payload.description ?? "",
        priority: payload.priority,
        status: "todo",
        due_date: payload.dueDate ?? null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } finally {
      setSaving(false);
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────────
  const updateTask = async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: string | null;
    }>
  ) => {
    let updatedTask: Task | null = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const u: Task = {
            ...t,
            ...(updates.title !== undefined && { title: updates.title }),
            ...(updates.description !== undefined && { description: updates.description }),
            ...(updates.status !== undefined && { status: updates.status }),
            ...(updates.priority !== undefined && { priority: updates.priority }),
            ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
            updated_at: new Date().toISOString(),
            ...(updates.status === "completed" && { completed_at: new Date().toISOString() }),
            ...(updates.status !== undefined && updates.status !== "completed" && { completed_at: null }),
          };
          updatedTask = u;
          return u;
        }
        return t;
      })
    );
    return updatedTask!;
  };

  // ── Toggle (todo → in_progress → completed cycle) ────────────────────────────
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next: TaskStatus =
      task.status === "todo"
        ? "in_progress"
        : task.status === "in_progress"
        ? "completed"
        : "todo";
    await updateTask(id, { status: next });
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Derived counts ────────────────────────────────────────────────────────────
  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return {
    tasks,
    loading,
    error,
    saving,
    counts,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
