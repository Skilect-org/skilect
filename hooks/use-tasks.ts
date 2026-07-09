"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDashboard } from "./use-dashboard";

export interface Task {
  id: string;
  user_id: string;
  roadmap_id: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed";
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = Task["status"];

export function useTasks() {
  const { stats } = useDashboard();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Track if this is the first time data is being loaded
  const isInitialLoad = useRef(true);

  const fetchTasks = useCallback(async () => {
    if (isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const activeRoadmapId = stats?.activeRoadmaps?.[0]?.id;
      const url = activeRoadmapId 
        ? `/api/tasks?roadmapId=${activeRoadmapId}` 
        : "/api/tasks";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      isInitialLoad.current = false; // Background updates won't toggle loading screen
    }
  }, [stats?.activeRoadmaps]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload: {
    title: string;
    description?: string;
    dueDate?: string | null;
    roadmapId?: string;
  }) => {
    setSaving(true);
    try {
      const activeRoadmapId = stats?.activeRoadmaps?.[0]?.id;
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          description: payload.description || "",
          dueDate: payload.dueDate || null,
          roadmapId: payload.roadmapId || activeRoadmapId || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const data = await res.json();
      setTasks((prev) => [data.task, ...prev]);
      return data.task;
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.task } : t)));
      return data.task;
    } catch (err) {
      fetchTasks(); // Rollback configuration on error
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next: TaskStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "completed" : "todo";
    await updateTask(id, { status: next });
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
  };

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