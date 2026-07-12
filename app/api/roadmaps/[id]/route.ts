import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Type params as a Promise
) {
  try {
    // 1. Await the params before accessing the ID
    const { id: roadmapId } = await params;
    
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Initialize Supabase Admin to bypass RLS for secure server-side deletion
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Verify ownership
    const { data: roadmap, error: fetchError } = await supabaseAdmin
      .from("roadmaps")
      .select("user_id")
      .eq("id", roadmapId)
      .single();

    if (fetchError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }
    
    if (roadmap.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden: Access Denied" }, { status: 403 });
    }

    // 3. Delete child records first to prevent foreign key constraint errors
    await supabaseAdmin.from("tasks").delete().eq("roadmap_id", roadmapId);
    await supabaseAdmin.from("skill_nodes").delete().eq("roadmap_id", roadmapId);
    
    // 4. Delete the parent roadmap
    const { error: deleteError } = await supabaseAdmin.from("roadmaps").delete().eq("id", roadmapId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: "Roadmap removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("🚨 Roadmap Deletion Failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}