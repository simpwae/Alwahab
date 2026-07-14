import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Plain supabase-js, not @supabase/ssr's cookie-syncing browser client: the
// whole app is Client Components today (see server.ts, unused so far), and
// AuthContext/AdminAuthContext each need their own independent session
// (a customer and an admin can be logged in at once, mirroring the mock
// architecture's separate alwahab_user/alwahab_admin localStorage keys) —
// that needs a distinct storageKey per client instance.
export function createClient(storageKey: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { storageKey } }
  );
}
