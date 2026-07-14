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
  roadmap_title?: string;
  milestone_name?: string;
}

export type TaskStatus = Task["status"];

export function useTasks() {
  const { stats } = useDashboard();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const isInitialLoad = useRef(true);

  // ⚡ FIX: Removed volatile stats dependencies to make the function reference completely stable 
  // ⚡ FIX: Appended a timestamp cache-buster to completely eliminate stale network cache hits
  const fetchTasks = useCallback(async () => {
    if (isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch(`/api/tasks?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const handleGlobalRefresh = () => {
      fetchTasks();
    };
    window.addEventListener("refresh-tasks-data", handleGlobalRefresh);
    return () => window.removeEventListener("refresh-tasks-data", handleGlobalRefresh);
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
      
      window.dispatchEvent(new Event("refresh-readiness"));
      return data.task;
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
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
      
      window.dispatchEvent(new Event("refresh-readiness"));
      window.dispatchEvent(new Event("refresh-tasks-data"));
      
      return data.task;
    } catch (err) {
      fetchTasks();
      throw err;
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    let next: TaskStatus;
    if (task.status === "todo") {
      next = "in_progress";
    } else if (task.status === "in_progress") {
      next = "completed";
    } else {
      next = "todo";
    }
    
    updateTask(id, { status: next }).catch((err) => console.error("Toggle failed", err));
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    window.dispatchEvent(new Event("refresh-readiness"));
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