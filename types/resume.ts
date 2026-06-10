/**
 * Resume Types
 *
 * Type definitions for resume analysis and improvement.
 */

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  analysis?: ResumeAnalysis;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: ResumeSuggestion[];
  skillsExtracted: string[];
}

export interface ResumeSuggestion {
  section: string;
  issue: string;
  recommendation: string;
  priority: "low" | "medium" | "high";
}
