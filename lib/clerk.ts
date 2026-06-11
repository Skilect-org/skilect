/**
 * Clerk Auth Helpers
 *
 * Exports Clerk authentication utilities for use in API routes and
 * server components. Import from here instead of directly from @clerk/nextjs
 * so we have a single place to swap auth logic if needed.
 *
 * Required env vars:
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *   CLERK_SECRET_KEY
 *   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
 *   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
 *   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
 *   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/assessment
 */

// Server-side helpers — use in API routes & Server Components
export { auth, currentUser } from "@clerk/nextjs/server";

// Client-side hooks — use in Client Components
export { useAuth, useUser } from "@clerk/nextjs";

// Route configuration for Clerk middleware (consumed in middleware.ts)
export const publicRoutes = ["/", "/sign-in(.*)", "/sign-up(.*)"];
export const ignoredRoutes = ["/api/webhook(.*)"];
