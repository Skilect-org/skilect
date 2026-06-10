/**
 * Roadmap Types
 *
 * Type definitions for AI-generated learning roadmaps and skill nodes.
 */

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "not_started" | "in_progress" | "completed";
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "article" | "video" | "course" | "documentation";
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description: string;
  nodes: SkillNode[];
  createdAt: Date;
  updatedAt: Date;
}
