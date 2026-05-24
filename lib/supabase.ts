import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public client — RLS applies. Used in browser and server contexts that
 * should not bypass row-level security.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/**
 * Service-role client — bypasses RLS. Server-only. Never expose to the browser.
 * Used for the clinic dashboard's read-across-patients queries.
 */
export function serviceSupabase(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseReady = Boolean(url && anonKey);
