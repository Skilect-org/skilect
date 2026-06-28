// app/api/roadmaps/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerSupabaseClient();

    // 1. Fetch all roadmaps for the user, ordered by creation date desc
    const { data: roadmaps, error: roadmapsError } = await db
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (roadmapsError) {
      console.error("[GET /api/roadmaps] Supabase fetch roadmaps error:", roadmapsError);
      return NextResponse.json({ error: "Failed to retrieve roadmaps" }, { status: 500 });
    }

    if (!roadmaps || roadmaps.length === 0) {
      return NextResponse.json({ roadmaps: [] });
    }

    // 2. Fetch all skill nodes (steps) for these roadmaps, ordered by creation date asc
    const roadmapIds = roadmaps.map((r) => r.id);
    const { data: skillNodes, error: skillNodesError } = await db
      .from("skill_nodes")
      .select("*")
      .in("roadmap_id", roadmapIds)
      .order("created_at", { ascending: true });

    if (skillNodesError) {
      console.error("[GET /api/roadmaps] Supabase fetch skill nodes error:", skillNodesError);
      return NextResponse.json({ error: "Failed to retrieve roadmap steps" }, { status: 500 });
    }

    // 3. Map nodes by roadmap ID
    const nodesByRoadmapId: Record<string, any[]> = {};
    (skillNodes || []).forEach((node) => {
      if (!nodesByRoadmapId[node.roadmap_id]) {
        nodesByRoadmapId[node.roadmap_id] = [];
      }

      // Safeguard resource parsing if it gets stored as text or JSON string
      let parsedResources = node.resources;
      if (typeof parsedResources === "string") {
        try {
          parsedResources = JSON.parse(parsedResources);
        } catch (e) {
          parsedResources = [];
        }
      }

      nodesByRoadmapId[node.roadmap_id].push({
        id: node.id,
        name: node.name,
        description: node.description,
        level: node.level,
        estimatedDays: node.estimated_days || 1,
        status: node.status,
        resources: parsedResources || [],
        tasks: node.tasks || [],
        dependencies: node.dependencies || [],
        step_index: nodesByRoadmapId[node.roadmap_id].length,
      });
    });

    // 4. Format roadmaps to match camelCase expectations on frontend
    const formattedRoadmaps = roadmaps.map((roadmap) => ({
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      targetRole: roadmap.target_role,
      estimatedWeeks: roadmap.estimated_weeks || 0,
      createdAt: roadmap.created_at,
      nodes: nodesByRoadmapId[roadmap.id] || [],
      skill_nodes: nodesByRoadmapId[roadmap.id] || [],
    }));

    return NextResponse.json({ roadmaps: formattedRoadmaps });

  } catch (error) {
    console.error("[GET /api/roadmaps] Server retrieval error:", error);
    return NextResponse.json({ error: "Internal Server Retrieval Error" }, { status: 500 });
  }
}