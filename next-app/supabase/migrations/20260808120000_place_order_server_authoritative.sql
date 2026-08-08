-- Security fix (P0): place_order() previously trusted the client for every
-- monetary value (subtotal/discount/shipping/total/item price) and even
-- payment_status, and never checked or decremented stock. A caller could
-- call the RPC directly (it's granted to anon for guest checkout) with
-- arbitrary numbers - e.g. p_total: 1 against a real cart - and the order
-- would be inserted verbatim. This rewrite makes the RPC the sole source of
-- truth for money: it re-derives every price from public.products (and, for
-- sized items, from the product's own sizes jsonb), recomputes the coupon
-- discount and shipping from live tables, locks and decrements stock in the
-- same transaction, and derives payment_status instead of accepting it.
--
-- The p_subtotal/p_discount/p_shipping/p_total/p_payment_status parameters
-- are kept in the signature (so existing callers don't need to change their
-- call shape) but are otherwise ignored, except p_total which is compared
-- against the server-computed total purely to surface tampering/staleness
-- as a loud error instead of silently accepting it.

create or replace function public.place_order(
  p_user_id uuid,
  p_customer text,
  p_email text,
  p_phone text,
  p_shipping_address jsonb,
  p_coupon_code text,
  p_subtotal numeric,
  p_discount numeric,
  p_shipping numeric,
  p_total numeric,
  p_payment_method text,
  p_payment_status text,
  p_receipt_image text,
  p_items jsonb
)
returns public.orders
language plpgsql
security definer set search_path = public
as $$
declare
  v_order public.orders;
  v_id text;
  v_item jsonb;
  v_product public.products;
  v_qty int;
  v_size text;
  v_unit_price numeric;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_shipping numeric := 0;
  v_total numeric;
  v_settings public.store_settings;
  v_coupon public.coupons;
  v_payment_status text;
begin
  if p_user_id is not null and p_user_id <> auth.uid() then
    raise exception 'user_id must match the authenticated user';
  end if;

  perform public.check_rate_limit(
    'place_order:' || coalesce(auth.uid()::text, public.request_ip()),
    5, interval '10 minutes'
  );

  if p_payment_method not in ('COD', 'BankTransfer', 'Safepay') then
    raise exception 'invalid payment method';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'order must contain at least one item';
  end if;
  if jsonb_array_length(p_items) > 100 then
    raise exception 'too many line items';
  end if;

  -- Unbounded text currently lands raw in emails and admin views - cap it.
  if length(coalesce(p_customer, '')) = 0 or length(p_customer) > 200 then
    raise exception 'invalid customer name';
  end if;
  if length(coalesce(p_email, '')) > 320
     or length(coalesce(p_phone, '')) > 40
     or length(coalesce(p_shipping_address ->> 'line1', '')) > 300
     or length(coalesce(p_shipping_address ->> 'city', '')) > 120 then
    raise exception 'field too long';
  end if;

  v_id := 'ALW-' || nextval('public.order_number_seq');

  -- Lock product rows in a deterministic order (by product_id) so two
  -- concurrent checkouts sharing products serialize instead of deadlocking.
  for v_item in
    select item
    from jsonb_array_elements(p_items) as item
    order by item ->> 'product_id'
  loop
    v_qty := (v_item ->> 'qty')::int;
    v_size := nullif(v_item ->> 'size', '');

    if v_qty is null or v_qty <= 0 or v_qty > 500 then
      raise exception 'invalid quantity for product %', v_item ->> 'product_id';
    end if;

    select * into v_product
    from public.products
    where id = v_item ->> 'product_id'
    for update;

    if not found then
      raise exception 'product % not found', v_item ->> 'product_id';
    end if;
    if v_product.status <> 'Active' then
      raise exception 'product % is not available', v_product.name;
    end if;

    if v_size is not null then
      select (elem ->> 'price')::numeric into v_unit_price
      from jsonb_array_elements(v_product.sizes) as elem
      where elem ->> 'label' = v_size;

      if v_unit_price is null then
        raise exception 'size % is not valid for product %', v_size, v_product.name;
      end if;
    else
      v_unit_price := v_product.selling_price;
    end if;

    if v_qty > v_product.stock_qty then
      raise exception 'insufficient stock for %', v_product.name;
    end if;

    update public.products
    set stock_qty = stock_qty - v_qty,
        units_sold = units_sold + v_qty
    where id = v_product.id;

    v_subtotal := v_subtotal + (v_unit_price * v_qty);
  end loop;

  -- Coupon: re-validated and priced server-side. sampleCoupons.ts's
  -- findValidCoupon()/calculateDiscount() remain for client-side UX only.
  if p_coupon_code is not null then
    select * into v_coupon from public.coupons where code = p_coupon_code for update;
    if not found then
      raise exception 'invalid coupon code';
    end if;
    if v_coupon.status <> 'Active' then
      raise exception 'coupon is not active';
    end if;
    if current_date < v_coupon.valid_from or current_date > v_coupon.valid_to then
      raise exception 'coupon has expired';
    end if;
    if v_subtotal < v_coupon.min_order then
      raise exception 'order does not meet the coupon minimum';
    end if;
    if v_coupon.usage_limit > 0 then
      if (select count(*) from public.orders where coupon_code = p_coupon_code) >= v_coupon.usage_limit then
        raise exception 'coupon usage limit reached';
      end if;
    end if;

    if v_coupon.type = '%' then
      v_discount := round(v_subtotal * v_coupon.value / 100);
    else
      v_discount := least(v_coupon.value, v_subtotal);
    end if;
  end if;

  select * into v_settings from public.store_settings where id = 1;
  if v_subtotal - v_discount >= v_settings.free_shipping_threshold then
    v_shipping := 0;
  else
    v_shipping := v_settings.flat_rate;
  end if;

  v_total := greatest(0, v_subtotal - v_discount) + v_shipping;

  -- Surfaces tampering or a stale client total (e.g. settings/coupon changed
  -- mid-checkout) as a loud, retryable error instead of silently mismatching.
  if p_total is not null and abs(v_total - p_total) > 1 then
    raise exception 'order total changed - please refresh your cart and try again';
  end if;

  -- payment_status is derived, never accepted from the client: nothing sent
  -- over the wire can create an order that already reads as 'Paid'.
  v_payment_status := case
    when p_payment_method = 'BankTransfer' then 'AwaitingVerification'
    else 'Pending'
  end;

  insert into public.orders (
    id, user_id, customer, email, phone, shipping_address, coupon_code,
    subtotal, discount, shipping, total, payment_method, payment_status,
    fulfillment_status, receipt_image
  )
  values (
    v_id, p_user_id, p_customer, p_email, p_phone, p_shipping_address, p_coupon_code,
    v_subtotal, v_discount, v_shipping, v_total, p_payment_method, v_payment_status,
    'Pending', p_receipt_image
  )
  returning * into v_order;

  insert into public.order_items (order_id, product_id, name, image, price, qty, size)
  select
    v_id,
    item ->> 'product_id',
    p.name,
    coalesce(nullif(item ->> 'image', ''), p.images[1]),
    case
      when nullif(item ->> 'size', '') is not null then (
        select (elem ->> 'price')::numeric
        from jsonb_array_elements(p.sizes) as elem
        where elem ->> 'label' = item ->> 'size'
      )
      else p.selling_price
    end,
    (item ->> 'qty')::int,
    nullif(item ->> 'size', '')
  from jsonb_array_elements(p_items) as item
  join public.products p on p.id = item ->> 'product_id';

  return v_order;
end;
$$;

-- ============================================================================
-- Rate limiter: opportunistically prune each key's own stale rows before
-- counting, instead of relying on the (never-scheduled) manual cleanup job
-- the original comment called for. Keeps rate_limit_hits bounded per key
-- without a cron job, and without changing the function's signature.
-- ============================================================================

create or replace function public.check_rate_limit(p_key text, p_max_count int, p_window interval)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
begin
  delete from public.rate_limit_hits
  where key = p_key and created_at <= now() - p_window;

  select count(*) into v_count
  from public.rate_limit_hits
  where key = p_key;

  if v_count >= p_max_count then
    raise exception 'rate_limit_exceeded';
  end if;

  insert into public.rate_limit_hits (key) values (p_key);
end;
$$;

-- ============================================================================
-- Missing indexes (scale plan C2f). Postgres does not auto-index foreign
-- keys, so every one of these was a full seq scan before now.
-- ============================================================================

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_date_idx on public.orders (date desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_status_idx on public.reviews (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_featured_idx on public.products (featured) where featured;
create index if not exists addresses_user_id_idx on public.addresses (user_id);

-- find_guest_order()/find_guest_order_items() filter on lower(trim(id)) and
-- lower(trim(email)), which defeats the plain primary-key index and forces
-- a full seq scan on every call - and this function is granted to anon.
create index if not exists orders_guest_lookup_idx
  on public.orders (lower(trim(id)), lower(trim(coalesce(email, ''))));
