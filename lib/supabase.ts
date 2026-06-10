/**
 * Supabase Client
 *
 * Initializes and exports the Supabase client for database operations.
 * Uses environment variables for configuration.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY (server-side only)
 */

// TODO: Install @supabase/supabase-js and uncomment
// import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key)
// export function createServerSupabaseClient() {
//   const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
//   return createClient(supabaseUrl, serviceRoleKey);
// }

export { supabaseUrl, supabaseAnonKey };
