/**
 * GET /api/dashboard
 *
 * Returns aggregated stats for the authenticated user's dashboard:
 *   - Readiness score (% of all tasks completed)
 *   - Task counts (total / completed / active)
 *   - Current daily streak
 *   - Recent activity feed (last 8 task events)
 *   - Roadmap count
 *
 * Auth: Clerk  |  DB: Supabase (service-role)
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerSupabaseClient();

  try {
    // ── 2. Fetch all user tasks ────────────────────────────────────────────
    const { data: tasks, error: tasksError } = await db
      .from("tasks")
      .select("id, status, completed_at, created_at, title, priority")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (tasksError) throw tasksError;

    const totalTasks = tasks?.length ?? 0;
    const completedTasks =
      tasks?.filter((t) => t.status === "completed").length ?? 0;
    const activeTasks =
      tasks?.filter((t) => t.status === "in_progress").length ?? 0;
    const readinessScore =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // ── 3. Streak — consecutive days with ≥1 completion ───────────────────
    const completionDates = (tasks ?? [])
      .filter((t) => t.completed_at)
      .map((t) => new Date(t.completed_at as string).toDateString());

    const uniqueDates = [...new Set(completionDates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      if (uniqueDates[i] === expected.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    // ── 4. Recent activity feed ────────────────────────────────────────────
    const recentActivities = (tasks ?? []).slice(0, 8).map((t) => ({
      id: t.id as string,
      title: t.title as string,
      description:
        t.status === "completed"
          ? "Task completed"
          : t.status === "in_progress"
          ? "Task in progress"
          : "Task added",
      timestamp: new Date(t.created_at as string).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      type: "task" as const,
    }));

    // ── 5. Roadmap count ───────────────────────────────────────────────────
    const { count: roadmapCount } = await db
      .from("roadmaps")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    // ── 6. Interview count ─────────────────────────────────────────────────
    const { count: interviewCount } = await db
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    return NextResponse.json({
      readinessScore,
      totalTasks,
      completedTasks,
      activeTasks,
      streak,
      roadmapCount: roadmapCount ?? 0,
      totalInterviews: interviewCount ?? 0,
      recentActivities,
    });
  } catch (error) {
    console.error("[/api/dashboard] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
