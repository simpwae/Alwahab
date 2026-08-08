# /scale-audit

You are auditing the Alwahab Next.js storefront + admin panel for scalability and performance. This is a real production-track e-commerce app. The goal is to find where the current implementation has a hard ceiling — a row count or traffic level at which something breaks or degrades badly — not generic "this could be faster" advice.

## Architecture briefing

- No SSR/ISR unless a prior round added it — check `'use client'` directives and any `revalidate`/`generateStaticParams`/`cache()` usage fresh each run.
- Ten-ish React contexts under `src/context/` are the primary data-fetching layer. Check `src/app/providers.tsx` for which are mounted globally (every route) vs scoped.
- Supabase Postgres is the only datastore unless a Redis layer has been added (`src/lib/redis.ts` / `src/lib/rate-limit.ts` — check for existence).
- Cloudinary hosts images; check whether delivery URLs carry transformation params or serve raw uploads.

## Evidence rules — non-negotiable

- Every finding needs `file:line` and quoted code.
- **State the row count or traffic level at which each finding actually breaks or meaningfully degrades** (e.g. "the admin dashboard fetch becomes multi-second around ~2,000 orders and effectively hangs past ~10,000" — not "this could be slow"). Reason from what the query/render actually does, not vibes.
- Distinguish "will break" (unbounded query, no pagination, O(n²) render) from "wastes resources but won't break" (missing memoization on a small array) — rank the former higher.
- Report what's already handled well (indexes that exist, queries that are already paginated/cached) so wins aren't re-flagged every run.

## Domain checklist

1. **Unbounded queries** — grep every `.from(...)` / `.select(...)` call across `src/context/` and `src/app/`. Which have no `.limit()`/`.range()`? Which do `select('*')` when only a few columns are used? For each, what does it fetch at realistic scale (e.g. 5,000 products, 50,000 orders, 20,000 reviews)?
2. **Global data mounting** — read `src/app/providers.tsx` (or wherever providers are composed). Which contexts fetch on mount and are mounted at the root, meaning every page view — including anonymous visits to static pages — triggers them? Does any admin-shaped fetch run for anonymous users (even if RLS returns empty, the round-trip and provider machinery still runs)?
3. **N+1 and O(n×m) render patterns** — look for `.find()`/`.filter()` calls inside `.map()` render loops (e.g. matching orders to customers by scanning the full order list per customer row). State the multiplication (rows × rows) and whether it's memoized.
4. **Database indexes** — read every migration file in `supabase/migrations/` and list every `create index`. Cross-reference against: every RLS policy's `using`/`with check` predicate, every `SECURITY DEFINER` function's `where` clause, and every app-level `.eq()`/`.filter()` call. Remember Postgres does **not** auto-index foreign keys — flag any FK column used in a filter/join with no explicit index. Flag any `lower()`/`trim()`/other function wrapping a filtered column with no matching expression index (defeats even a plain index).
5. **Aggregation location** — does any dashboard/stats view fetch raw rows into the browser/server and reduce them in JS (`.reduce()`, manual grouping) where a single SQL `sum`/`count`/`group by` would do the same work in the database? Quote both the current JS reduction and what the SQL equivalent would look like.
6. **Client-side search/filter/sort** — is filtering/sorting done over an in-memory array already downloaded to the client, or pushed to the database via query params? Check debouncing on any search-as-you-type input.
7. **Caching** — is there any cache layer (Redis, `unstable_cache`, `fetch` revalidate, SWR/react-query, HTTP cache headers)? For each cacheable read (catalog, settings, published reviews), is it cached, and is there an invalidation path when the underlying data changes (don't just flag missing caching — flag caching with no invalidation too, that's worse).
8. **Rendering strategy** — which routes are server-rendered vs client-only vs an empty server shell with `<Suspense fallback={null}>` around a client component (net effect: blank initial HTML)? Is there SSG/ISR/`generateStaticParams` anywhere it would make sense (catalog pages, product pages)? Any duplicate identical queries within one request (e.g. both `generateMetadata` and the page body querying the same row without `cache()`)?
9. **Images/assets** — is `next/image` used? Are dimensions/`sizes`/lazy-loading present? Do image URLs (Cloudinary or otherwise) carry format/quality/width transforms, or are full-resolution originals served into small UI slots?
10. **Bundle weight** — which heavy dependencies (charting, animation, rich text, etc.) are imported at module top-level in files that load on every page vs behind a route-specific or `dynamic()` boundary?
11. **Concurrency correctness** — for any endpoint that decrements inventory, redeems a limited-use coupon, or otherwise touches a shared counter: is it protected by a transaction/row lock (`SELECT ... FOR UPDATE`), or is there a race window where concurrent requests can both succeed past a limit meant to be enforced once?
12. **Realtime/polling** — any `setInterval` that triggers a network request on a tight cycle? Any Supabase Realtime subscriptions, and if none, do admin views have a stale-data problem when multiple admins edit concurrently?

## Output format

1. **Ranked findings table** — "breaks at N rows" or "wastes X resources," one-liner, file:line.
2. **Per-finding detail** — location, quoted code, the row-count/traffic reasoning, concrete fix.
3. **What's already fine** — caching/indexing/pagination that already exists and doesn't need touching.
4. **Suggested load-test scenario** — given the current findings, what would actually prove the fix worked (seed size, endpoint, metric, target number).
