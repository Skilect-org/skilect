/**
 * hooks/use-tasks.ts
 *
 * Full CRUD hook for tasks — wraps all /api/tasks calls.
 * Uses optimistic UI for toggle and delete so the UI feels instant.
 */

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

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks ?? []);
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
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          description: payload.description ?? "",
          priority: payload.priority,
          dueDate: payload.dueDate ?? undefined,
          roadmapId: payload.roadmapId ?? undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create task");
      }
      const { task } = await res.json();
      setTasks((prev) => [task, ...prev]);
      return task as Task;
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
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...(updates.title !== undefined && { title: updates.title }),
              ...(updates.description !== undefined && { description: updates.description }),
              ...(updates.status !== undefined && { status: updates.status }),
              ...(updates.priority !== undefined && { priority: updates.priority }),
              ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update task");
      }
      const { task } = await res.json();
      // Replace with server-confirmed version
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task as Task;
    } catch (err) {
      // Rollback on failure
      fetchTasks();
      throw err;
    }
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
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete task");
      }
    } catch (err) {
      // Rollback
      fetchTasks();
      throw err;
    }
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
