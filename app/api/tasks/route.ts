/**
 * /api/tasks
 *
 * GET  — Fetch all tasks for the authenticated user (with optional filters)
 *         Query params: ?status=todo|in_progress|completed  ?priority=low|medium|high
 *
 * POST — Create a new task
 *         Body: { title, description, priority, dueDate?, roadmapId? }
 *
 * PATCH — Update task status or fields
 *         Body: { id, status?, title?, description?, priority?, dueDate? }
 *
 * Auth: Clerk  |  DB: Supabase (service-role)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";

// ── Schemas ────────────────────────────────────────────────────────────────────
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional(),
  roadmapId: z.string().uuid().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

// ── GET ────────────────────────────────────────────────────────────────────────
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
    console.error("[GET /api/tasks] Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }

  return NextResponse.json({ tasks });
}

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = CreateTaskSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", details: error },
      { status: 400 }
    );
  }

  const db = createServerSupabaseClient();
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/tasks] Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }

  return NextResponse.json({ task }, { status: 201 });
}

// ── PATCH ──────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = UpdateTaskSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", details: error },
      { status: 400 }
    );
  }

  const { id, ...updates } = body;

  // If marking complete, stamp completed_at
  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
    ...(updates.status === "completed"
      ? { completed_at: new Date().toISOString() }
      : {}),
  };

  const db = createServerSupabaseClient();
  const { data: task, error } = await db
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId) // ensure ownership
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/tasks] Error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }

  return NextResponse.json({ task });
}
