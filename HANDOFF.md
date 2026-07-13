# Alwahab — Handoff

## 1. Goal

Build out the Alwahab storefront beyond the customer-facing base (Phases 1–4): **Phase 5 (Auth + Customer Account)**, then the **Admin Panel** (project docs' "Phases 6–10"). Requested phase-by-phase / section-by-section so progress is trackable one step at a time. Mock-only for now (localStorage + in-memory React context, no backend) — the user's stated end goal is a real backend on **Next.js + Supabase**, but that's a separate future migration, done after the UI is proven.

## 2. Current state

**Phase 5 (Auth + Customer Account)** is complete: mock login/signup, protected `/account/*` routes, a real (non-fake) wishlist, order history, address book, and profile editing.

**Admin Panel** is complete, built in two passes:
- **Shell**: `/admin/login`, protected `/admin` dashboard with real stat tiles, dark sidebar shell.
- **Six follow-up sections**, each fully wired to shared React contexts (not disconnected admin-only state) so admin actions are real: deleting a product removes it from storefront listings, approving a review makes it appear on the PDP, editing shipping settings changes Cart/Checkout math.
  - **Orders** — list + detail with fulfillment/payment status and tracking-number editing.
  - **Products** — list + add/edit form. New `ProductContext` replaced the static `sampleProducts` import across 6 storefront consumers (Home, CategoryListing, SearchResults, ProductDetail, AccountWishlist, Header search).
  - **Customers** — read-only list + detail with order history.
  - **Coupons** — list + add/edit form. New `CouponContext`; `findValidCoupon` now takes the coupon list as a parameter instead of closing over the static export; Cart wired to it.
  - **Reviews** — moderation list with inline Approve/Reject. New `ReviewContext`; ProductDetail's approved-reviews display now reads from it.
  - **Settings** — bank-transfer + shipping form. New `StoreSettingsContext`; BankTransferPanel, Checkout, and Cart all read from it instead of the static `storeSettings` export.

**Responsive/styling pass** done on the admin panel afterward (the newest, least-tested part — the customer storefront from Phases 1–4 already followed the token/breakpoint conventions consistently). Biggest fix: the admin sidebar was a full-height dark block stacking above all content on mobile; it's now a compact horizontal icon bar on mobile/tablet and a full labeled sidebar on desktop (`lg:` breakpoint), matching the responsive pattern `AccountNav` already used elsewhere. Also: semantic color-coding on dashboard stat tiles (amber/red for "needs attention" tiles vs. teal/blue for neutral ones), progressive column-hiding on the Products/Coupons tables instead of forced horizontal scroll, and larger touch targets on icon buttons. This pass was verified with actual Playwright screenshots (see §5) across mobile/tablet/desktop, not just code reading — caught and fixed one real bug (Coupons table's delete icon was pushed off-screen at 390px width).

`npm run lint` is clean relative to baseline (2 pre-existing errors — `BankTransferPanel.tsx` empty arrow function, `CartContext.tsx` inferrable-type — same as before all this work, no new ones introduced).

`/admin/<anything not yet listed above>` returning 404 is expected — the catch-all route still applies.

Plan docs (sub-phase breakdowns + decisions) live at:
- `C:\Users\SIMPWAE\.claude\plans\start-doing-it-and-luminous-hammock.md` (Phase 5)
- `C:\Users\SIMPWAE\.claude\plans\sharded-stirring-sonnet.md` (Admin panel shell + follow-ups — this file was overwritten between the two planning passes, so it currently reflects the follow-ups plan, not the shell)

## 3. Active files

**Phase 5** — created: `src/data/sampleUsers.ts`, `src/context/AuthContext.tsx`, `src/context/WishlistContext.tsx`, `src/components/ProtectedRoute.tsx`, `src/components/account/AccountLayout.tsx`, `src/components/account/AccountNav.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/pages/NotFound.tsx`, `src/pages/AccountDashboard.tsx`, `src/pages/AccountOrders.tsx`, `src/pages/AccountOrderDetail.tsx`, `src/pages/AccountWishlist.tsx`, `src/pages/AccountAddresses.tsx`, `src/pages/AccountProfile.tsx`.

**Admin Panel** — created:
- `src/data/sampleAdmins.ts`
- `src/context/AdminAuthContext.tsx`, `ProductContext.tsx`, `CouponContext.tsx`, `ReviewContext.tsx`, `StoreSettingsContext.tsx` (all mirror `OrderContext`'s `useState`-seeded-from-sample-data + mutator-function pattern)
- `src/components/admin/AdminProtectedRoute.tsx`, `AdminSidebar.tsx`, `AdminLayout.tsx`
- `src/pages/admin/`: `AdminLogin.tsx`, `AdminDashboard.tsx`, `AdminOrders.tsx`, `AdminOrderDetail.tsx`, `AdminProducts.tsx`, `AdminProductForm.tsx`, `AdminCustomers.tsx`, `AdminCustomerDetail.tsx`, `AdminCoupons.tsx`, `AdminCouponForm.tsx`, `AdminReviews.tsx`, `AdminSettings.tsx`

Modified: `src/App.tsx` (all providers + routes, now ~15 route entries under `/admin/*`), `src/types/index.ts` (`Admin` type), `src/context/OrderContext.tsx` (`updateOrder`), `src/data/sampleCoupons.ts` (`findValidCoupon` takes a coupons param), `src/components/layout/Header.tsx` (wishlist + product-search wiring), `src/components/checkout/BankTransferPanel.tsx`, `src/pages/Cart.tsx`, `src/pages/Checkout.tsx` (settings/coupon context wiring), `src/pages/Home.tsx`, `CategoryListing.tsx`, `SearchResults.tsx`, `ProductDetail.tsx` (`ProductContext`/`ReviewContext` wiring), `src/components/home/FlashDeals.tsx`, `ProductSection.tsx`, `src/components/listing/ProductGrid.tsx`, `src/components/product/RelatedProducts.tsx` (Phase 5 wishlist prop wiring).

Not touched (deliberately): `src/pages/StyleGuide.tsx` and `src/pages/admin/AdminDashboard.tsx`'s low-stock tile still import `sampleProducts` directly — Phase-1 design-reference page and already-admin-side, both low value to wire.

## 4. Changes made

See §2 for the section-by-section breakdown. One architectural note not obvious from the file list: **every admin CRUD section is backed by a real React context, not local-only admin state** — this was an explicit user decision (offered as a choice: "fully wired" vs. "admin-only, storefront unchanged") made because a disconnected admin panel would be theater, not a real feature demo.

## 5. Failed attempts / hiccups

- **`git status` initially failed everywhere** ("dubious ownership" — repo owned by a different Windows SID than the current session user) in both the Bash tool and PowerShell. Did **not** fix this with `git config --global --add safe.directory` (that's a persisted config change, off-limits). Used `git -c safe.directory='D:/Projects/alwahab' <command>` instead — a per-invocation flag, not a config write — for every git command this session.
- **Bash tool and PowerShell tool appear to run in separate process namespaces** on this machine: a `npm run dev` backgrounded via Bash was invisible to PowerShell's `Get-CimInstance Win32_Process` (used successfully in the *previous* session to clean up stray vite processes), even though `curl` from Bash could reach it fine on `localhost`. `pkill -f vite` from the Bash tool worked reliably to stop dev servers started from Bash — use that directly instead of the PowerShell/Win32_Process approach next time, contradicting what the previous session's handoff recommended.
- **No browser-automation tool was available by default** this session either. Installed Playwright + Chromium **into the scratchpad directory only** (not the project's `package.json`/`node_modules`) after asking the user for confirmation, since it's a real download/environment change. This let me actually screenshot the app across breakpoints and catch a real mobile-overflow bug (Coupons table delete icon pushed off-screen) that code-reading alone had missed. Worth doing this earlier in future sessions rather than defaulting to "no browser tool available" — ask once, it's a one-time cost.
- Several stray `vite` dev-server processes accumulated across the session (ports 5173–5175) from repeated verification runs; cleaned up with `pkill -f vite` at the end, but worth doing after *every* verification round rather than batching cleanup.
- `.claude/settings.local.json` was untracked and not covered by the existing `.gitignore`'s `*.local` pattern (that pattern only matches files literally ending in `.local`, not `.local.json`). Added `.claude/settings.local.json` specifically to `.gitignore` rather than committing a machine-local file.

## 6. Next steps

- **Admin panel gaps not built**: bulk actions (multi-select delete), pagination on list pages (fine for current sample-data volumes, would matter at real scale), no guard against deleting a product/coupon that's referenced by existing orders (mock data only, so low risk today).
- **No password-change / real credential store** anywhere (customer or admin) — flagged as a deliberate cut in the Phase 5 handoff, still true.
- **Phase 6 (future, not started, naming collision flagged previously)**: migrate Vite → Next.js (App Router), stand up Supabase, replace the internals of every context (`AuthContext`, `AdminAuthContext`, `ProductContext`, `CouponContext`, `ReviewContext`, `StoreSettingsContext`, `OrderContext`, `CartContext`, `WishlistContext`) with real Supabase-backed auth + Postgres tables, keeping the same hook interfaces so no page rewrites are needed. Needs its own plan when started.
- No test suite exists in this repo — if any of the above should get automated coverage, that decision (and a framework choice) needs to happen first.
