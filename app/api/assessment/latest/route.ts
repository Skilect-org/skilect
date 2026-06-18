/**
 * /api/assessment/latest/route.ts
 * Secure server-side fetch to bypass frontend Supabase RLS token issues.
 */
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
    // 1. Fetch the latest active roadmap for this authenticated user
    const { data: roadmap, error: roadmapError } = await db
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (roadmapError) throw roadmapError;
    
    if (!roadmap) {
      return NextResponse.json({ roadmap: null, tasks: [] });
    }

    // 2. Fetch all accompanying tasks assigned to this roadmap
    const { data: tasks, error: tasksError } = await db
      .from("tasks")
      .select("description")
      .eq("roadmap_id", roadmap.id)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (tasksError) throw tasksError;

    return NextResponse.json({
      roadmap,
      tasks: tasks ? tasks.map((t) => t.description) : []
    });
    
  } catch (error: any) {
    console.error("Server-side results fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}