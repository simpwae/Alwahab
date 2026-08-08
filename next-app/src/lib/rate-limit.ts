import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from './redis';

export type RateLimitResult = { success: boolean; limit: number; remaining: number };

// Fail-open: if Redis isn't configured or is unreachable, allow the request
// rather than taking the whole app down over a rate-limiter dependency.
// This mirrors the previous SQL check_rate_limit() behavior (best-effort),
// while payment idempotency (webhook dedupe, one-time tokens) uses
// getRedisOrFailClosed() instead and blocks on failure.
const OPEN: RateLimitResult = { success: true, limit: 0, remaining: 0 };

function makeLimiter(prefix: string, requests: number, window: `${number} ${'s' | 'm' | 'h'}`) {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `alwahab:rl:${prefix}`,
    analytics: false
  });
}

// Named limiters, one per sensitive surface. Values mirror what the SQL
// rate limiter previously enforced (place_order, guest order lookup) plus
// new coverage for endpoints that had none (login, signup, notify, checkout).
const limiters = {
  placeOrder: () => makeLimiter('place-order', 5, '10 m'),
  guestOrderLookup: () => makeLimiter('guest-order', 8, '15 m'),
  customerLogin: () => makeLimiter('customer-login', 10, '10 m'),
  adminLogin: () => makeLimiter('admin-login', 10, '10 m'),
  signup: () => makeLimiter('signup', 5, '30 m'),
  ordersNotify: () => makeLimiter('orders-notify', 10, '10 m'),
  safepayCheckout: () => makeLimiter('safepay-checkout', 10, '10 m')
};

export type RateLimitName = keyof typeof limiters;

export async function checkRateLimit(name: RateLimitName, key: string): Promise<RateLimitResult> {
  const limiter = limiters[name]();
  if (!limiter) return OPEN;

  try {
    const { success, limit, remaining } = await limiter.limit(key);
    return { success, limit, remaining };
  } catch {
    // Upstash unreachable — fail open rather than block all traffic.
    return OPEN;
  }
}
