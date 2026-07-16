# Alwahab — CLAUDE.md

Next.js storefront + admin panel for **Alwahab**, a multi-category online store. Currency is PKR. Backed by Supabase (Postgres + Auth) — no mock data left except `CartContext` (deliberately local/ephemeral, pre-checkout state).

Full project history, phase status, and data-shape reference: see [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md). Read it before starting new feature work.

## Commands

All commands run from `next-app/` (the only app in this repo — the original Vite app has been retired):

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm test` — vitest (pure-function tests only)

## Stack

Next.js 16 (App Router) + TypeScript, React 19, Tailwind CSS v4, Supabase (Postgres + Auth), sonner (toasts), lucide-react (icons), framer-motion.

## Conventions

- Reuse shared primitives in `next-app/src/components/ui/` (`Button`, `FormField`, `StatusBadge`) — don't build parallel versions.
- Use Tailwind **token classes** (`bg-primary`, `text-accent`, `bg-surface`, `text-ink-muted`, `rounded-xl`, `shadow-card`), never raw hex values. Tokens are defined in `next-app/src/app/globals.css`'s `@theme` block (Tailwind v4 CSS-first config, not a JS file).
- `accent` (amber/orange) is reserved for CTAs, sale badges, and discounts. `primary` (teal) is for everything else.
- Order/product/payment status badges must use the shared variant maps exported from `StatusBadge` (`PRODUCT_STATUS_VARIANT`, `PAYMENT_STATUS_VARIANT`, `FULFILLMENT_STATUS_VARIANT`) so badges stay consistent across screens.
- Every list/data screen needs Loading (skeleton), Empty, Error, and Success states — use the kit in `next-app/src/components/states/`.
- Keep field names in `next-app/src/types/index.ts` identical everywhere data flows (`Product`, `Order`, `User`, `Address`, `Coupon`, `Review`).
- All data lives in React context (`next-app/src/context/`) backed by Supabase, not a global store — `CartContext` (mock/local, deliberately), `OrderContext` (splits into `useOrders()`/`useAdminOrders()`), `ProductContext`, `CouponContext`, `ReviewContext`, `StoreSettingsContext`, `WishlistContext`, `AuthContext`, `AdminAuthContext`.

## Current status

Full customer storefront, customer account, and admin panel are built and live on Next.js, all 9 non-cart contexts backed by real Supabase tables (RLS-gated). Deployed to Vercel at `alwahab.vercel.app`. See `handoff.md` for the detailed session-by-session history; `PROJECT-CONTEXT.md` describes the original pre-migration Vite-era plan and is now historical.
