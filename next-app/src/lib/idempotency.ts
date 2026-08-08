import { randomUUID } from 'crypto';
import { getRedis } from './redis';

/**
 * Marks a webhook event as processed exactly once. Returns true the first
 * time a given key is seen, false on every replay.
 *
 * Fails OPEN (returns true) when Redis is unreachable: the
 * `.eq('payment_status', 'Pending')` precondition in the webhook handler
 * (src/app/api/safepay/webhook/route.ts) is the primary replay guard and is
 * independent of Redis, so a Redis outage degrades to "no extra dedup
 * layer" rather than "real customer payments never get confirmed."
 */
export async function claimWebhookEvent(eventKey: string, ttlSeconds = 60 * 60 * 24): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true;
  try {
    const result = await redis.set(`alwahab:webhook:${eventKey}`, '1', { nx: true, ex: ttlSeconds });
    return result === 'OK';
  } catch {
    return true;
  }
}

/**
 * Issues a short-lived, single-use token scoped to one order, used to
 * authorize /api/orders/notify and /api/safepay/checkout without requiring
 * a full customer session (guest checkout has none). Returned by
 * /api/orders/place only once, at order-creation time.
 *
 * Returns null when Redis isn't configured — callers must treat that as
 * "this order has no token" and degrade the *gated action* (skip
 * auto-notify, block Safepay checkout with a clear error), never as a
 * reason to fail order placement itself.
 */
export async function issueOrderToken(orderId: string, purpose: 'notify' | 'safepay-checkout', ttlSeconds = 60 * 30): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const token = randomUUID();
    await redis.set(`alwahab:order-token:${purpose}:${token}`, orderId, { ex: ttlSeconds });
    return token;
  } catch {
    return null;
  }
}

/**
 * Atomically consumes a one-time order token. Returns the orderId it was
 * issued for, or null if invalid/expired/already-used/Redis-unavailable —
 * callers must reject the request on null (fail closed: no Redis means no
 * way to verify the token, so the token-gated action is refused).
 */
export async function consumeOrderToken(token: string, purpose: 'notify' | 'safepay-checkout'): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const orderId = await redis.getdel<string>(`alwahab:order-token:${purpose}:${token}`);
    return orderId ?? null;
  } catch {
    return null;
  }
}
