import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Extract the expanded payload sent from the frontend
  const { roadmapId, isActive, allNodes } = await request.json();
  const db = createServerSupabaseClient();

  // 1. Update the roadmap's active status
  // This ensures that if you uncheck a task, the roadmap goes back to "Active" (true)
  const { error: roadmapError } = await db
    .from("roadmaps")
    .update({ is_active: isActive })
    .eq("id", roadmapId);

  if (roadmapError) {
    console.error("Failed to update roadmap status:", roadmapError);
    return NextResponse.json({ error: "Failed to update roadmap status" }, { status: 500 });
  }

  // 2. Perform bulk updates on all cascading nodes
  // We loop through the `allNodes` array so the future nodes actually get reset in the database
  if (allNodes && Array.isArray(allNodes)) {
    const updatePromises = allNodes.map((node) => 
      db
        .from("skill_nodes")
        .update({ 
          tasks: node.tasks, 
          status: node.status 
        })
        .eq("id", node.id)
    );

    // Wait for all node updates to finish
    await Promise.all(updatePromises);
  }

  return NextResponse.json({ success: true });
}