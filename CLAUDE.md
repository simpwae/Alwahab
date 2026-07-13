# Alwahab — CLAUDE.md

React + TypeScript storefront (Vite) for **Alwahab**, a multi-category online store. Currency is PKR. Customer-facing UI only — no backend, no auth yet (mock data throughout).

Full project history, phase status, and data-shape reference: see [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md). Read it before starting new feature work.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint over `.js/.jsx/.ts/.tsx`
- `npm run preview` — preview a production build

No test suite exists yet.

## Stack

React 18.3 + TypeScript, Vite 5, Tailwind CSS 3.4, react-router-dom 6, sonner (toasts), lucide-react (icons), framer-motion.

## Conventions

- Reuse shared primitives in `src/components/ui/` (`Button`, `FormField`, `StatusBadge`) — don't build parallel versions.
- Use Tailwind **token classes** (`bg-primary`, `text-accent`, `bg-surface`, `text-ink-muted`, `rounded-xl`, `shadow-card`), never raw hex values. Tokens are defined in `tailwind.config.js`.
- `accent` (amber/orange) is reserved for CTAs, sale badges, and discounts. `primary` (teal) is for everything else.
- Order/product/payment status badges must use the shared variant maps exported from `StatusBadge` (`PRODUCT_STATUS_VARIANT`, `PAYMENT_STATUS_VARIANT`, `FULFILLMENT_STATUS_VARIANT`) so badges stay consistent across screens.
- Every list/data screen needs Loading (skeleton), Empty, Error, and Success states — use the kit in `src/components/states/`.
- Keep field names in `src/types/index.ts` identical everywhere data flows (`Product`, `Order`, `User`, `Address`, `Coupon`, `Review`).
- Cart/Order state lives in React context (`src/context/`), not a global store — `CartContext`, `OrderContext`. No auth/user context exists yet; Phase 5 will need to add one (mock is fine, this is a prototype).

## Current status

Phases 1–4 built (design system, homepage, listing/search/PDP, cart/checkout/order-confirmation/track-order). Phase 5 (auth + account) and Phases 6–10 (admin) are **not started**. See PROJECT-CONTEXT.md for the exact routing gaps and what Phase 5 needs to wire up.
