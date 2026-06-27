/**
 * /api/tasks
 *
 * GET    — Fetch all tasks for the user (?status=  ?priority=)
 * POST   — Create a new task
 * PATCH  — Update a task (status, title, description, priority, dueDate)
 * DELETE — Delete a task (?id=uuid)
 *
 * Auth: Clerk  |  DB: Supabase service-role
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Schemas ───────────────────────────────────────────────────────────────────
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
  roadmapId: z.string().uuid().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().nullable().optional(),
});

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const priorityFilter = searchParams.get("priority");

  const db = createServerSupabaseClient();

  let query = db
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (statusFilter) query = query.eq("status", statusFilter);
  if (priorityFilter) query = query.eq("priority", priorityFilter);

  const { data: tasks, error } = await query;

  if (error) {
    console.error("[GET /api/tasks]", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }

  return NextResponse.json({ tasks: tasks ?? [] });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = CreateTaskSchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body", details: err },
      { status: 400 }
    );
  }

  const db = createServerSupabaseClient();
  const now = new Date().toISOString();

  const { data: task, error } = await db
    .from("tasks")
    .insert({
      user_id: userId,
      title: body.title,
      description: body.description,
      priority: body.priority,
      status: "todo",
      due_date: body.dueDate ?? null,
      roadmap_id: body.roadmapId ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/tasks]", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }

  return NextResponse.json({ task }, { status: 201 });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = UpdateTaskSchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body", details: err },
      { status: 400 }
    );
  }

  const { id, dueDate, ...rest } = body;
  const now = new Date().toISOString();

  const payload: Record<string, unknown> = {
    ...rest,
    updated_at: now,
    ...(dueDate !== undefined && { due_date: dueDate }),
    // Stamp completed_at when marking done; clear it when un-completing
    ...(rest.status === "completed" && { completed_at: now }),
    ...(rest.status !== undefined && rest.status !== "completed" && { completed_at: null }),
  };

  const db = createServerSupabaseClient();

  const { data: task, error } = await db
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId) // ownership check
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/tasks]", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }

  if (!task) {
    return NextResponse.json(
      { error: "Task not found or access denied" },
      { status: 404 }
    );
  }

  return NextResponse.json({ task });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  // Validate it's a UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  const db = createServerSupabaseClient();

  const { error } = await db
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // ownership check — can't delete another user's task

  if (error) {
    console.error("[DELETE /api/tasks]", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
