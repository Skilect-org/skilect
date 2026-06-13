/**
 * Supabase Client
 *
 * Provides two clients:
 *  - `supabase`             → anon key, safe for client-side use
 *  - `createServerSupabaseClient()` → service role key, SERVER-SIDE ONLY
 *    (bypasses Row Level Security — never expose to the browser)
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY  (server-side only)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// ── Client-side Supabase client (uses anon key) ──────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Server-side Supabase client (uses service role key) ─────────────────────
// Call this inside API routes only — never import in client components.
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("[Supabase] Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabaseUrl, supabaseAnonKey };
