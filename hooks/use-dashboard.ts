"use client";

import { useState, useEffect } from "react";

export interface DashboardStatItem {
  label: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  roadmapCount: number;
  streak: number;
  readinessScore: number;
  totalInterviews: number;
  readinessBreakdown: DashboardStatItem[];
}

const mockDashboardStats: DashboardStats = {
  totalTasks: 20,
  completedTasks: 12,
  roadmapCount: 3,
  streak: 4,
  readinessScore: 72,
  totalInterviews: 5,
  readinessBreakdown: [
    { label: "Technical Skills", value: 65, color: "#3b82f6" },
    { label: "Resume Quality", value: 45, color: "#8b5cf6" },
    { label: "Interview Prep", value: 55, color: "#f59e0b" },
    { label: "Projects", value: 72, color: "#10b981" },
  ],
};

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStats(mockDashboardStats);
      setLoading(false);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    stats,
    loading,
    error,
  };
}
