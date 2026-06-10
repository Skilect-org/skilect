/**
 * Interview Types
 *
 * Type definitions for AI-powered mock interview sessions.
 */

export interface InterviewSession {
  id: string;
  userId: string;
  type: "technical" | "behavioral" | "hr";
  status: "scheduled" | "in_progress" | "completed";
  score?: number;
  feedback?: string;
  questions: InterviewQuestion[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  expectedAnswer?: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
  category: string;
}
