import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().default(""),
  dueDate: z.string().nullable().optional(),
  roadmapId: z.string().uuid().nullable().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string(), 
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  dueDate: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(), 
});

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const db = createServerSupabaseClient();

  // 1. Get standalone tasks
  let query = db.from("tasks").select("*").eq("user_id", userId);
  if (statusFilter) query = query.eq("status", statusFilter);
  const { data: dbTasks, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });

  let allTasks = [...(dbTasks ?? [])];

  // 2. Get roadmap milestone tasks from JSON arrays
  const { data: roadmaps } = await db
    .from("roadmaps")
    .select('id, skill_nodes(id, tasks)')
    .eq("user_id", userId);

  if (roadmaps) {
    roadmaps.forEach((rm) => {
      rm.skill_nodes?.forEach((node: any) => {
        if (Array.isArray(node.tasks)) {
          node.tasks.forEach((t: any) => {
            const currentStatus = t.status || "todo"; // Standardize dynamic roadmap task statuses
            
            if (!statusFilter || currentStatus === statusFilter) {
              allTasks.push({
                ...t,
                id: `${node.id}_${t.id}`, 
                status: currentStatus, // FIX: Guarantees status field exists natively on delivery to frontend
                roadmap_id: rm.id,
                node_id: node.id,
                created_at: t.created_at || new Date().toISOString(),
                updated_at: t.updated_at || new Date().toISOString(),
              });
            }
          });
        }
      });
    });
  }

  allTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ tasks: allTasks });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = CreateTaskSchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request", details: err }, { status: 400 });
  }

  const db = createServerSupabaseClient();
  const { data: userExists } = await db.from("users").select("clerk_id").eq("clerk_id", userId).maybeSingle();

  if (!userExists) {
    const clerkUser = await currentUser();
    if (clerkUser) {
      await db.from("users").upsert({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "user@example.com",
        first_name: clerkUser.firstName || "",
        last_name: clerkUser.lastName || "",
        updated_at: new Date().toISOString()
      }, { onConflict: "clerk_id" });
    }
  }

  const now = new Date().toISOString();
  const { data: task, error } = await db
    .from("tasks")
    .insert({
      user_id: userId,
      title: body.title,
      description: body.description,
      status: "todo",
      due_date: body.dueDate ?? null,
      roadmap_id: body.roadmapId ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  return NextResponse.json({ task }, { status: 201 });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = UpdateTaskSchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request", details: err }, { status: 400 });
  }

  const { id, dueDate, due_date, ...rest } = body;
  const now = new Date().toISOString();
  const resolvedDueDate = dueDate !== undefined ? dueDate : due_date;

  const payload: Record<string, unknown> = {
    ...rest,
    updated_at: now,
    ...(resolvedDueDate !== undefined && { due_date: resolvedDueDate }),
  };

  let targetTaskId = id;
  let targetNodeId: string | null = null;
  if (id.includes('_')) {
    const parts = id.split('_');
    targetNodeId = parts[0];
    targetTaskId = parts[1];
  }

  const db = createServerSupabaseClient();

  if (!id.includes('_')) {
    const { data: task } = await db
      .from("tasks")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (task) {
      return NextResponse.json({ task });
    }
  }

  const { data: roadmaps } = await db
    .from("roadmaps")
    .select('id, skill_nodes(id, tasks)')
    .eq("user_id", userId);

  if (roadmaps) {
    for (const rm of roadmaps) {
      for (const node of (rm.skill_nodes || [])) {
        if (targetNodeId && node.id !== targetNodeId) continue;

        if (Array.isArray(node.tasks)) {
          const taskIndex = node.tasks.findIndex((t: any) => t.id === targetTaskId);
          if (taskIndex !== -1) {
            node.tasks[taskIndex] = { ...node.tasks[taskIndex], ...payload };
            
            if (node.tasks[taskIndex].id.includes('_')) {
              node.tasks[taskIndex].id = targetTaskId;
            }

            const { error: updateError } = await db
              .from("skill_nodes")
              .update({ tasks: node.tasks })
              .eq("id", node.id);

            if (updateError) throw updateError;
            
            return NextResponse.json({ 
              task: {
                ...node.tasks[taskIndex],
                id: `${node.id}_${targetTaskId}`, 
                roadmap_id: rm.id,
                node_id: node.id
              } 
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ error: "Task not found" }, { status: 404 });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing task id" }, { status: 400 });

  let targetTaskId = id;
  let targetNodeId: string | null = null;
  if (id.includes('_')) {
    const parts = id.split('_');
    targetNodeId = parts[0];
    targetTaskId = parts[1];
  }

  const db = createServerSupabaseClient();

  if (!id.includes('_')) {
    await db.from("tasks").delete().eq("id", id).eq("user_id", userId);
  }

  const { data: roadmaps } = await db
    .from("roadmaps")
    .select('id, skill_nodes(id, tasks)')
    .eq("user_id", userId);

  if (roadmaps) {
    for (const rm of roadmaps) {
      for (const node of (rm.skill_nodes || [])) {
        if (targetNodeId && node.id !== targetNodeId) continue;

        if (Array.isArray(node.tasks)) {
          const originalLength = node.tasks.length;
          const filteredTasks = node.tasks.filter((t: any) => t.id !== targetTaskId);
          
          if (filteredTasks.length < originalLength) {
            await db.from("skill_nodes").update({ tasks: filteredTasks }).eq("id", node.id);
          }
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}