// types/roadmap.ts

export type NodeStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'documentation';
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  status: NodeStatus;
  order: number;
  resources: Resource[];
}

export interface Roadmap {
  id: string;
  userId: string;
  jobRole: string;
  skills: SkillNode[];
  createdAt: string;
}