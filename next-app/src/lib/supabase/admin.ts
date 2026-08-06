import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client for server-only code (route handlers) that must write
// to `orders` outside of a browser admin session - e.g. a Safepay webhook,
// which has no cookies/session and so can't satisfy the orders_write_admin
// RLS policy that OrderContext's updateOrder() relies on.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
