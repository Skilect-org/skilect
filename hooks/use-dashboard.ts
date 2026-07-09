import { useState, useEffect, useCallback, useRef } from "react";

export interface DashboardStatItem {
  label: string;
  value: number;
  color: string;
}

export interface ActiveRoadmap {
  id: string;
  title: string;
  target_role: string;
  totalSteps: number;
  completedSteps: number;
  progress: number;
  color: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  roadmapCount: number;
  activeRoadmaps: ActiveRoadmap[];
  streak: number;
  readinessScore: number;
  totalInterviews: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track if this is the first time data is being loaded
  const isInitialLoad = useRef(true);

  const fetchStats = useCallback(async () => {
    if (isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      isInitialLoad.current = false; // Background updates won't toggle loading screen
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}