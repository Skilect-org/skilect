/**
 * Task Types
 *
 * Type definitions for preparation tasks and assignments.
 */

export interface Task {
  id: string;
  userId: string;
  roadmapId?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  status?: Task["status"];
  priority?: Task["priority"];
  roadmapId?: string;
}
