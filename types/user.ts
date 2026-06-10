/**
 * User Types
 *
 * Type definitions for user profiles and authentication.
 */

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  skills: string[];
  targetRole?: string;
  experience?: string;
  education?: string;
  assessmentCompleted: boolean;
}
