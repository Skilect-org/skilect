/**
 * Clerk Auth Helpers
 *
 * Exports Clerk authentication utilities and configuration.
 * Uses environment variables for configuration.
 *
 * Required env vars:
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *   CLERK_SECRET_KEY
 *   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
 *   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
 *   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
 *   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/assessment
 */

// TODO: Install @clerk/nextjs and uncomment
// export { auth, currentUser } from "@clerk/nextjs/server";
// export { useAuth, useUser } from "@clerk/nextjs";

// Route configuration for Clerk middleware
export const publicRoutes = ["/", "/sign-in(.*)", "/sign-up(.*)"];
export const ignoredRoutes = ["/api/webhook(.*)"];
