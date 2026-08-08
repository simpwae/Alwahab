# /security-audit

You are performing a security audit of the Alwahab Next.js storefront + admin panel. This is a real production-track codebase handling PKR payments (COD, bank transfer, Safepay cards) for a public multi-category store. Treat every finding as something that could cost the business money or expose customer PII — not an academic checklist exercise.

## Architecture briefing — read this before forming any opinion

This is **not** a typical Next.js app. Do not assume standard patterns apply until you've verified them in this repo:

- **There is no `middleware.ts`** (unless a prior audit round added one — check first). No server-side gating exists unless explicitly built.
- **There are no Server Actions.** Grep for `'use server'` to confirm current state.
- **Only a handful of API routes exist** under `src/app/api/`. Enumerate them fresh each run — don't rely on a remembered count.
- **Every other read/write goes browser → Supabase PostgREST directly**, using the public anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), shipped in the JS bundle. This is by design, not a bug — the real enforcement layer is **Postgres RLS policies** and **`SECURITY DEFINER` RPC functions** in `supabase/migrations/`.
- **Client-side route guards (`AdminProtectedRoute`, `ProtectedRoute`) are cosmetic UI redirects.** They stop rendering, they do not stop a direct API/PostgREST call. Never describe them as "protecting" a data path — only RLS and RPC logic do that.
- **Order IDs are a plain Postgres sequence** (`ALW-10235`, `ALW-10236`, …). Treat them as fully enumerable/guessable in every finding that touches order lookups.
- Sessions are stored in **localStorage**, not cookies (unless a prior round migrated to `@supabase/ssr` cookie sessions — check `src/lib/supabase/client.ts` and whether `middleware.ts` exists and reads a session). This determines whether server components can ever be auth-aware.

Before writing any finding, actually read the current state of: `src/app/api/**/route.ts`, every file in `supabase/migrations/` (policies AND functions), `src/lib/supabase/*.ts`, `src/context/*.tsx`, and `next.config.ts` / `middleware.ts` if present. Do not reuse conclusions from a previous audit without re-verifying — the codebase changes between runs.

## Attacker personas — run a distinct pass for each

1. **Anonymous internet** — has only the anon key from the JS bundle. Can call any PostgREST table/RPC endpoint directly (not just through the UI), call the public API routes, and enumerate `ALW-*` order IDs. Assume they use `curl` and browser devtools, not just the rendered UI.
2. **Authenticated customer** — everything persona 1 has, plus a valid JWT for their own account. Can they read/modify another user's orders, addresses, or profile? Forge reviews? Self-promote to admin? Tamper with prices, coupons, or payment status on their own order?
3. **Rogue or compromised admin** — has `is_admin() = true`. Can their writes (product descriptions, coupon data, settings) reach a stored-XSS sink that fires for *other* users (customers, other admins)? What's the blast radius of one compromised admin credential?
4. **Replaying/spoofing payment processor** — controls what looks like a Safepay webhook payload. Can they forge a valid signature? Replay a captured valid one? Cause an amount mismatch to settle an order for less than its total? Race the webhook against manual admin order edits?

## Domain checklist, in priority order

1. **Money & price integrity** — trace the full path from cart → order placement → payment. Is any monetary value (subtotal, discount, shipping, total, item price, payment_status) accepted from the client without server-side recomputation? This is almost always the highest-impact category in this codebase.
2. **RLS policies** — read every `create policy` in every migration file, exhaustively. For each: what table, what operation, what's the `using`/`with check` expression, and can it be bypassed or is it missing an operation entirely (e.g. a table with SELECT policy but no INSERT policy — is that intentional or a gap)?
3. **`SECURITY DEFINER` functions** — these bypass RLS by design. Enumerate every one in every migration. For each: who is it `granted to` (anon/authenticated/none), and does its body independently re-check authorization (`is_admin()`, `auth.uid()` match) before acting? A `SECURITY DEFINER` function with no internal check, granted to `anon`, is a full RLS bypass.
4. **API route auth** — for every route under `src/app/api/`: does it call `supabase.auth.getUser()` or otherwise verify the caller? Does it use `createAdminClient()` (service role, bypasses RLS entirely)? Combine "no auth + service role + attacker-controlled ID param" as the highest-severity shape to look for.
5. **Secrets & env** — grep all `process.env.*` usage. Flag anything server-only that's `NEXT_PUBLIC_`-prefixed. Check `.gitignore` covers `.env*` at every level. Check git history for committed secrets (`git log --all --diff-filter=A --name-only`, and grep history for key-shaped strings like `eyJ`, `sk_`, `re_`).
6. **Input validation & injection** — is there a schema validation layer? Which routes/RPCs accept unbounded/unvalidated strings? Any raw string interpolation into SQL, shell, or HTML?
7. **XSS/HTML injection** — grep `dangerouslySetInnerHTML`, `innerHTML`, raw `<script>` blocks, and anywhere DB-sourced or client-submitted text reaches an email template or HTML sink. For each hit, trace whether the source data is attacker-reachable (admin-only input is lower severity than customer-submitted input) — don't stop at the grep match.
8. **Rate limiting & enumeration** — which endpoints (login, admin login, signup, order lookup, order placement, notify/webhook routes) have no rate limit? Does any response distinguish "wrong password" from "valid credentials, wrong role" (an account-existence oracle)? Is anything sequential/guessable that should be a random token?
9. **Headers/CSP** — read `next.config.ts` and any `middleware.ts` in full. Is there a CSP, `frame-ancestors`/`X-Frame-Options`, HSTS, `X-Content-Type-Options`? Is `X-Powered-By` disabled?
10. **Dependencies** — run `npm audit` (or note that you can't execute it and ask for the output). Cross-check versions of anything payment/auth/email-related against known CVEs.
11. **PII/compliance** — what customer data (name, phone, address, bank receipt images) ends up on a publicly-readable URL or table? Any retention/deletion gap?

## Evidence rules — non-negotiable

- Every finding must cite `file:line` and quote the actual code, not a paraphrase.
- Every finding must include a **concrete exploit**: the literal `curl` command, `supabase.rpc(...)` call, or request sequence an attacker would run. If you can't construct one, it's not a finding yet — keep digging or downgrade it to a note.
- **Rank by exploitability, not category.** An unauthenticated, no-precondition, financial-impact bug outranks an authenticated admin-only issue, regardless of which "category" (XSS vs auth vs money) each falls into.
- **Explicitly list what is correctly defended**, with the same file:line rigor, in a "Verified safe" section. This prevents re-litigating the same non-issues every run and gives a true signal of what changed. Carry forward known-good patterns from prior rounds (e.g. "webhook HMAC verification fails closed") but re-verify the code still does what you remember — don't just assert it.
- **Verify, don't pattern-match.** A grep hit is a lead, not a finding. Trace data flow from source to sink before reporting.
- Coverage must be exhaustive for RLS policies and `SECURITY DEFINER` functions specifically — partial coverage there is exactly how real holes survive audits. List every single one, even to say "fine, no issue."

## Output format

1. **Ranked findings table** — severity/exploitability, one-line summary, file:line.
2. **Per-finding detail** — location, quoted code, concrete exploit, impact, concrete fix.
3. **Verified safe** — what you checked and found correctly defended, with evidence.
4. **Residual risk** — anything you couldn't fully verify (e.g. depends on a third-party dashboard setting not visible in the repo — point to `docs/security-checklist-external.md` for those) and what would need to be true elsewhere for a finding to actually be exploitable.
