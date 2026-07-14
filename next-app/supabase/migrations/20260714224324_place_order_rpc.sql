-- ============================================================================
-- Checkout support: orders/order_items had SELECT and admin-UPDATE policies
-- only (see initial_schema.sql) - nothing could ever INSERT a new order.
-- place_order() closes that gap as a single SECURITY DEFINER RPC rather than
-- RLS INSERT policies on both tables, so the order + its line items are
-- written atomically (one function call = one implicit transaction) and a
-- guest can never write into someone else's order_items by guessing an
-- order_id (which a same-shape RLS INSERT policy on order_items would risk,
-- since order_items itself doesn't carry a user_id to check ownership
-- against). Mirrors the find_guest_order()/handle_new_user() pattern
-- already established in initial_schema.sql.
-- ============================================================================

-- Replaces the old mock app's client-side `orderCounter` (a module-scoped
-- variable that reset to 10235 on every page reload - fine for disconnected
-- mock state, unsafe against a real persisted table where it would start
-- colliding with existing order ids the moment the page reloaded).
create sequence public.order_number_seq start with 10235;

create function public.place_order(
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
  -- A logged-in customer may only place an order as themselves; guests pass
  -- p_user_id = null, which is always allowed (mirrors the mock app, where
  -- checkout never required login).
  if p_user_id is not null and p_user_id <> auth.uid() then
    raise exception 'user_id must match the authenticated user';
  end if;

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

  insert into public.order_items (order_id, product_id, name, image, price, qty)
  select v_id, item ->> 'product_id', item ->> 'name', item ->> 'image',
    (item ->> 'price')::numeric, (item ->> 'qty')::int
  from jsonb_array_elements(p_items) as item;

  return v_order;
end;
$$;

grant execute on function public.place_order(
  uuid, text, text, text, jsonb, text, numeric, numeric, numeric, numeric, text, text, text, jsonb
) to anon, authenticated;

-- Companion to find_guest_order(): that RPC returns bare order rows (no
-- items), since it was built before checkout/order_items existed end-to-end.
-- order_items has no guest-accessible path of its own (its RLS policy only
-- allows the order's owner or an admin), so a guest looking up their order
-- via /track-order needs this same id+email-gated bypass to see the line
-- items too.
create function public.find_guest_order_items(p_order_id text, p_email text)
returns setof public.order_items
language sql
security definer set search_path = public
stable
as $$
  select oi.*
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where lower(trim(o.id)) = lower(trim(p_order_id))
    and lower(trim(coalesce(o.email, ''))) = lower(trim(p_email));
$$;

grant execute on function public.find_guest_order_items(text, text) to anon, authenticated;
