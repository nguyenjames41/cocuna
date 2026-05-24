import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client. Null when env isn't set — caller checks before using.
 * Lets the demo work offline against mocks without crashing.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          // Web uses localStorage; native uses AsyncStorage — but for the
          // demo we keep auth ephemeral so the demo switcher doesn't fight
          // a persisted session. Easy to flip on later.
          persistSession: Platform.OS === 'web',
          autoRefreshToken: Platform.OS === 'web',
          detectSessionInUrl: Platform.OS === 'web',
        },
      })
    : null;

export const isSupabaseReady = Boolean(supabase);

export const RAD_FUNCTION = process.env.EXPO_PUBLIC_RAD_FUNCTION ?? 'cocuna-rad';

/**
 * Ensure an anonymous session exists so RLS policies fire correctly.
 * Returns the user id or null if Supabase isn't configured.
 */
export async function ensureAnonSession(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) return session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('[cocuna] anonymous sign-in failed', error.message);
    return null;
  }
  return data.user?.id ?? null;
}
