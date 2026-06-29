import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerSupabaseClient();

  try {
    // 1. Fetch the computed score
    const { data: assessment } = await db
      .from("assessment_results")
      .select("score, feedback")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. Fetch the latest active roadmap
    const { data: roadmap, error: roadmapError } = await db
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!roadmap) return NextResponse.json({ roadmap: null, assessment: null, tasks: [] });

    // 3. Fetch tasks from the tasks table (since your team's code places them here now)
    const { data: tasks } = await db
      .from("tasks")
      .select("title")
      .eq("roadmap_id", roadmap.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      roadmap,
      assessment, // Exposing this to the UI
      tasks: tasks ? tasks.map((t) => t.title) : []
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}