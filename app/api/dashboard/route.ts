import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerSupabaseClient();

  try {
    // 1. Fetch standalone tasks from the tasks table
    const { data: dbTasks, error: tasksError } = await db
      .from("tasks")
      .select("id, status, updated_at, created_at, title, roadmap_id, due_date")
      .eq("user_id", userId);

    if (tasksError) throw tasksError;

    // 2. Fetch Active Roadmaps WITH their embedded skill_nodes tasks AND status
    const { data: roadmaps } = await db
      .from("roadmaps")
      .select(`
        id, 
        title, 
        target_role,
        skill_nodes ( id, tasks, status )
      `)
      .eq("user_id", userId)
      .eq("is_active", true);

    // 3. Combine both task sources into one unified array strictly for global metrics
    let allTasks = [...(dbTasks ?? [])];
    const activeRoadmaps = [];

    if (roadmaps && roadmaps.length > 0) {
      for (const roadmap of roadmaps) {
        
        // Extract tasks embedded in skill_nodes to keep global task metrics accurate
        if (roadmap.skill_nodes) {
          roadmap.skill_nodes.forEach((node: any) => {
            if (Array.isArray(node.tasks)) {
              node.tasks.forEach((t: any) => {
                const normalizedTask = {
                  id: t.id,
                  title: t.title,
                  status: t.status || "todo",
                  roadmap_id: roadmap.id,
                  due_date: t.due_date || null,
                  created_at: t.created_at || new Date().toISOString(),
                  updated_at: t.updated_at || new Date().toISOString(),
                };
                allTasks.push(normalizedTask); // Add to global pool
              });
            }
          });
        }

        // GROUND TRUTH FIX: Calculate roadmap progress strictly using high-level milestones (skill_nodes)
        const rmTotal = roadmap.skill_nodes ? roadmap.skill_nodes.length : 0;
        const rmCompleted = roadmap.skill_nodes 
          ? roadmap.skill_nodes.filter((node: any) => node.status === "completed").length 
          : 0;

        const progress = rmTotal > 0 ? Math.round((rmCompleted / rmTotal) * 100) : 0;

        // AUTOMATIC ARCHIVE LOGIC
        if (rmTotal > 0 && rmCompleted === rmTotal) {
          await db.from("roadmaps").update({ is_active: false }).eq("id", roadmap.id);
          continue; 
        }

        activeRoadmaps.push({
          id: roadmap.id,
          title: roadmap.title,
          target_role: roadmap.target_role,
          totalSteps: rmTotal,        // Consistently shows milestone totals (e.g., 9, 6)
          completedSteps: rmCompleted,  // Consistently shows completed milestones
          progress: progress,
          color: "#3b82f6" 
        });
      }
    }

    // 4. Calculate global task metrics using the COMBINED list
    allTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const completionDates = allTasks
      .filter((t) => t.status === "completed" && t.updated_at)
      .map((t) => new Date(t.updated_at).toDateString());

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

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "completed").length;
    const activeTasks = allTasks.filter((t) => t.status === "in_progress" || t.status === "todo").length;
    const readinessScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 5. Fetch Interview session count
    const { count: interviewCount } = await db
      .from("interviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    return NextResponse.json({
      readinessScore,
      totalTasks,
      completedTasks,
      activeTasks,
      streak,
      roadmapCount: activeRoadmaps.length,
      activeRoadmaps,
      totalInterviews: interviewCount ?? 0,
    });
  } catch (error) {
    console.error("[/api/dashboard] Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}