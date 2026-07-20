-- Adds free-text size labels to products (e.g. "S"/"M"/"L" or "150cm"/"1m",
-- admin's choice per product - not a fixed enum) and threads the customer's
-- chosen size through order_items via place_order(). Stock stays a single
-- shared number per product, not tracked per-size.

alter table public.products add column sizes text[] not null default '{}';
alter table public.order_items add column size text;

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
