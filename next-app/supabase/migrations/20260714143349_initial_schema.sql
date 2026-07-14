-- Phase 6b: initial schema, RLS policies, and helper functions.
-- Mirrors next-app/src/types/index.ts. See HANDOFF.md / the 6b plan for context.

-- ============================================================================
-- Tables
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  joined_date date not null default current_date
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  line1 text not null,
  city text not null,
  phone text not null
);

create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null
);

create table public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  images text[] not null default '{}',
  description text not null default '',
  specs text[] not null default '{}',
  original_price numeric not null,
  selling_price numeric not null,
  discount_pct int not null default 0,
  stock_qty int not null default 0,
  low_stock_threshold int not null default 5,
  sku text not null unique,
  units_sold int not null default 0,
  rating numeric not null default 0,
  review_count int not null default 0,
  ribbon text not null default 'none',
  status text not null default 'Draft',
  featured boolean not null default false
);

create table public.coupons (
  code text primary key,
  type text not null,
  value numeric not null,
  min_order numeric not null default 0,
  usage_limit int not null default 0,
  valid_from date not null,
  valid_to date not null,
  status text not null
);

create table public.orders (
  id text primary key,
  user_id uuid references public.profiles (id) on delete set null,
  date date not null default current_date,
  customer text not null,
  email text,
  phone text,
  shipping_address jsonb,
  coupon_code text references public.coupons (code) on delete set null,
  subtotal numeric not null,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null,
  payment_method text not null,
  payment_status text not null,
  fulfillment_status text not null,
  receipt_image text,
  tracking_number text
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  image text,
  price numeric not null,
  qty int not null
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  customer text not null,
  rating int not null,
  title text,
  comment text not null,
  date date not null default current_date,
  status text not null default 'Pending',
  verified_purchase boolean not null default false
);

create table public.wishlist_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  primary key (user_id, product_id)
);

create table public.store_settings (
  id smallint primary key default 1 check (id = 1),
  bank_name text not null default '',
  account_title text not null default '',
  account_number text not null default '',
  iban text not null default '',
  branch_code text not null default '',
  flat_rate numeric not null default 0,
  free_shipping_threshold numeric not null default 0
);

-- ============================================================================
-- New-user trigger: auto-create a profiles row on signup
-- ============================================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- is_admin() helper, reused across every admin-gated policy below
-- ============================================================================

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ============================================================================
-- find_guest_order() RPC: lets an unauthenticated visitor look up an order by
-- id + email (today's /track-order flow), without granting row-level SELECT
-- on all orders. Mirrors OrderContext.findOrder()'s case-insensitive/trimmed
-- match.
-- ============================================================================

create function public.find_guest_order(p_order_id text, p_email text)
returns setof public.orders
language sql
security definer set search_path = public
stable
as $$
  select *
  from public.orders
  where lower(trim(id)) = lower(trim(p_order_id))
    and lower(trim(coalesce(email, ''))) = lower(trim(p_email));
$$;

grant execute on function public.find_guest_order(text, text) to anon, authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.store_settings enable row level security;

-- profiles: owner or admin
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- addresses: owner or admin
create policy "addresses_all_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses_select_admin" on public.addresses
  for select using (public.is_admin());

-- admins: visible only to self or other admins; no public access
create policy "admins_select_self_or_admin" on public.admins
  for select using (auth.uid() = id or public.is_admin());

-- products: public read, admin write
create policy "products_select_public" on public.products
  for select using (true);
create policy "products_write_admin" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- coupons: public read, admin write
create policy "coupons_select_public" on public.coupons
  for select using (true);
create policy "coupons_write_admin" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- store_settings: public read, admin write
create policy "store_settings_select_public" on public.store_settings
  for select using (true);
create policy "store_settings_write_admin" on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- orders / order_items: owner or admin (guests use find_guest_order() instead)
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_write_admin" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
create policy "order_items_select_own_or_admin" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- reviews: approved reviews are public; authenticated users insert their own;
-- admin moderates
create policy "reviews_select_approved_or_admin" on public.reviews
  for select using (status = 'Approved' or public.is_admin());
create policy "reviews_insert_authenticated" on public.reviews
  for insert with check (auth.uid() is not null);
create policy "reviews_update_admin" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());

-- wishlist_items: owner only
create policy "wishlist_items_all_own" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
