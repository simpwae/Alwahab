-- ============================================================================
-- Apply check_rate_limit() (see rate_limiting.sql) to the three guest-callable
-- RPCs that were previously unlimited.
-- ============================================================================

-- find_guest_order / find_guest_order_items: 8 lookups per 15 min per IP,
-- each function keyed separately since both are granted to `anon` and
-- callable independently over PostgREST (not only via OrderContext.findOrder,
-- which happens to call both together).
create or replace function public.find_guest_order(p_order_id text, p_email text)
returns setof public.orders
language plpgsql
security definer set search_path = public
as $$
begin
  perform public.check_rate_limit('guest_order:' || public.request_ip(), 8, interval '15 minutes');

  return query
  select *
  from public.orders
  where lower(trim(id)) = lower(trim(p_order_id))
    and lower(trim(coalesce(email, ''))) = lower(trim(p_email));
end;
$$;

create or replace function public.find_guest_order_items(p_order_id text, p_email text)
returns setof public.order_items
language plpgsql
security definer set search_path = public
as $$
begin
  perform public.check_rate_limit('guest_order_items:' || public.request_ip(), 8, interval '15 minutes');

  return query
  select oi.*
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where lower(trim(o.id)) = lower(trim(p_order_id))
    and lower(trim(coalesce(o.email, ''))) = lower(trim(p_email));
end;
$$;

-- place_order: 5 orders per 10 min, keyed by user for logged-in checkout,
-- by IP for guest checkout (p_user_id = null is allowed - see place_order_rpc.sql).
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
begin
  if p_user_id is not null and p_user_id <> auth.uid() then
    raise exception 'user_id must match the authenticated user';
  end if;

  perform public.check_rate_limit(
    'place_order:' || coalesce(auth.uid()::text, public.request_ip()),
    5, interval '10 minutes'
  );

  v_id := 'ALW-' || nextval('public.order_number_seq');

  insert into public.orders (
    id, user_id, customer, email, phone, shipping_address, coupon_code,
    subtotal, discount, shipping, total, payment_method, payment_status,
    fulfillment_status, receipt_image
  )
  values (
    v_id, p_user_id, p_customer, p_email, p_phone, p_shipping_address, p_coupon_code,
    p_subtotal, p_discount, p_shipping, p_total, p_payment_method, p_payment_status,
    'Pending', p_receipt_image
  )
  returning * into v_order;

  insert into public.order_items (order_id, product_id, name, image, price, qty, size)
  select v_id, item ->> 'product_id', item ->> 'name', item ->> 'image',
    (item ->> 'price')::numeric, (item ->> 'qty')::int, item ->> 'size'
  from jsonb_array_elements(p_items) as item;

  return v_order;
end;
$$;
