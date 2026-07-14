-- Admin delete for orders. orders_write_admin (initial_schema.sql) only
-- covers UPDATE; there was no way to delete an order at all before this.
--
-- order_items also needs its own DELETE policy, not just orders: deleting a
-- row from `orders` cascades to `order_items` via its `on delete cascade`
-- foreign key, and that cascade is itself subject to order_items' own RLS,
-- not just the policy on `orders` - without this, an admin's DELETE on
-- orders would fail (or silently drop only the parent row, depending on
-- how the cascade is blocked) because order_items currently only has a
-- SELECT policy.
create policy "orders_delete_admin" on public.orders
  for delete using (public.is_admin());

create policy "order_items_delete_admin" on public.order_items
  for delete using (public.is_admin());
