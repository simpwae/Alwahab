import { Redis } from '@upstash/redis';

let client: Redis | null | undefined;

/**
 * Returns null when Upstash isn't configured or unreachable. Every caller
 * decides for itself what "no Redis" means for its own operation — see
 * src/lib/idempotency.ts and src/lib/rate-limit.ts for the two failure
 * modes used in this app. Order placement itself never depends on this:
 * money is validated inside the place_order SQL RPC regardless of Redis.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  // KV_REST_API_URL/TOKEN is what Vercel's Upstash Marketplace integration
  // provisions; UPSTASH_REDIS_REST_URL/TOKEN is Upstash's own naming for a
  // database connected outside that integration. Support both rather than
  // requiring a specific provisioning path.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    client = null;
    return client;
  }

  client = new Redis({ url, token });
  return client;
}
