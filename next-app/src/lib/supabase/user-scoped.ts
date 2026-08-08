import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Server-side client that acts *as* a specific end-user by forwarding their
// access token, so RLS / auth.uid() inside RPCs (place_order, etc.) resolve
// exactly as they would from the browser, without needing the service-role
// key. Omit the token for guest/unauthenticated calls (anon role).
export function createUserScopedClient(accessToken?: string | null) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } } : undefined
  );
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}
