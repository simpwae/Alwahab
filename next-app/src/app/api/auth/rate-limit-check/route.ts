import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RateLimitName } from '../../../../lib/rate-limit';
import { getClientIp } from '../../../../lib/supabase/user-scoped';

// Customer login, admin login, and signup call supabase.auth.* directly from
// the browser - there's no Next.js server in that request path to rate-limit
// against. This route is a pre-flight check the client calls first: it adds
// real, distributed throttling in front of brute-force/credential-stuffing
// attempts without proxying the auth call itself (which would mean
// reimplementing session adoption via setSession() for no real gain here).
const SURFACES: Record<string, RateLimitName> = {
  'customer-login': 'customerLogin',
  'admin-login': 'adminLogin',
  signup: 'signup'
};

export async function POST(request: NextRequest) {
  const { surface, email } = await request.json().catch(() => ({}));
  const limiterName = typeof surface === 'string' ? SURFACES[surface] : undefined;
  if (!limiterName) {
    return NextResponse.json({ error: 'Invalid surface.' }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const key = typeof email === 'string' && email ? `${ip}:${email.toLowerCase().trim()}` : ip;

  const { success } = await checkRateLimit(limiterName, key);
  if (!success) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 });
  }

  return NextResponse.json({ ok: true });
}
