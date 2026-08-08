# External security checklist (not visible from the repo)

The `/security-audit` slash command can only see this codebase. These settings live in third-party dashboards and need to be checked manually, on a cadence (recheck whenever credentials rotate or a new service is added).

## Supabase (project dashboard → Authentication / Database)

- [ ] **Leaked password protection** enabled (Auth → Policies).
- [ ] Minimum password length ≥ 8 (currently only enforced client-side at `src/app/signup/page.tsx`).
- [ ] Email confirmation required before login.
- [ ] OTP / magic-link expiry set to a short window.
- [ ] JWT expiry is reasonable (short-lived access token, refresh token rotation on).
- [ ] Per-endpoint Auth rate limits (signup, login, password reset, OTP) are at sane defaults — the app has no application-level rate limit on these beyond Supabase's own.
- [ ] **Storage**: confirm no buckets exist unless intentionally added (`supabase/config.toml` has the bucket block commented out as of the last audit — if a bucket now exists, confirm its policies aren't public-write).
- [ ] `anon` and `authenticated` role grants match what the migrations declare — no extra grants added by hand via the dashboard SQL editor that aren't in version control.
- [ ] Postgres version has no pending security patches (Database → Settings).
- [ ] Point-in-time recovery / backups are configured.
- [ ] Database webhooks (if any) point to expected URLs only.

## Cloudinary

- [ ] The unsigned upload preset (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, public in the JS bundle) has: max file size, allowed formats restricted to jpg/png/webp, max resolution, and a folder restriction.
- [ ] Moderation (auto or manual) enabled if available on your plan.
- [ ] Delivery URLs use `f_auto,q_auto` — confirm this was actually applied in code (see scale plan C4), then confirm the account isn't serving un-transformed originals by mistake.

## Resend

- [ ] Sending domain has SPF, DKIM, and DMARC all passing (not just DKIM).
- [ ] `RESEND_FROM_EMAIL` matches the verified domain exactly.
- [ ] Suppression list / bounce handling reviewed periodically — an enumeration bug that mass-emails invalid addresses (see B5 in the remediation plan) can tank sender reputation even after the code is fixed.

## Safepay

- [ ] Confirm which environment (`SAFEPAY_ENVIRONMENT`) is live in production — sandbox keys should never be the production config.
- [ ] Webhook URL registered in the Safepay dashboard matches the deployed `/api/safepay/webhook` route exactly (including domain).
- [ ] `SAFEPAY_WEBHOOK_SECRET` in Vercel env matches what's configured in the Safepay dashboard.
- [ ] IP allowlist for webhook calls enabled, if Safepay offers one.
- [x] Confirmed `SAFEPAY_V1_SECRET` is set in production env (2026-08-08) — was missing from local `.env.local` only, not from Vercel.

## Vercel

- [ ] Environment variables are scoped correctly per environment (Production/Preview/Development) — no production secrets leaking into preview deployments.
- [ ] Preview deployments don't expose production Supabase data (i.e. preview builds point at a separate project or are access-gated).
- [ ] Deployment protection (password/SSO) enabled on preview URLs if they're reachable from outside the team.
- [ ] `X-Powered-By` and framework fingerprinting headers reviewed.

## Upstash Redis

- [x] Connected (2026-08-08) via the Vercel Marketplace integration, not a standalone Upstash account. This provisions `KV_REST_API_URL` / `KV_REST_API_TOKEN` (not `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) — `src/lib/redis.ts` reads both naming schemes, preferring `KV_REST_API_*`.
- [x] Connectivity verified end-to-end (2026-08-08): a raw set/get round-trip, and a live 10-request sliding-window test against `/api/auth/rate-limit-check` confirming requests 1-10 succeed and 11+ return 429.
- [ ] TLS-only connections enforced.
- [ ] Token scoped to this project only, not a shared/global token reused elsewhere.
- [ ] Eviction policy set appropriately (rate-limit and idempotency keys should not be evicted before their TTL under memory pressure — use `noeviction` or size the plan so eviction never triggers).
- [ ] Upstash region matches the Vercel deployment region to minimize latency — check both in their respective dashboards.

## Credential rotation ledger

Keep a running log (outside the repo) of: which secret, when last rotated, by whom. At minimum rotate `SUPABASE_SERVICE_ROLE_KEY`, `SAFEPAY_API_KEY`/`SAFEPAY_V1_SECRET`/`SAFEPAY_WEBHOOK_SECRET`, and `RESEND_API_KEY` if the seeded-admin or any other credential-exposure finding (B8) is ever confirmed live in production.
