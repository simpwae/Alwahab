-- Scale fix: the admin dashboard previously fetched every order (with every
-- line item), every product, every review, and every customer into the
-- browser just to compute a handful of counts/sums and a 5-row "recent
-- orders" list - and did so via useAdminOrders()/useProducts()/etc, which
-- have no LIMIT. This RPC does the same computation as a handful of SQL
-- aggregates instead, so the dashboard's payload stays flat as the store
-- grows instead of scaling with total order history.
create or replace function public.admin_dashboard_stats(p_granularity text default 'daily')
returns jsonb
language plpgsql
security definer set search_path = public
stable
as $$
declare
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if p_granularity not in ('daily', 'monthly') then
    raise exception 'invalid granularity';
  end if;

  select jsonb_build_object(
    'totalRevenue', coalesce((select sum(total) from public.orders), 0),
    'totalOrders', (select count(*) from public.orders),
    'pendingOrders', (select count(*) from public.orders where fulfillment_status in ('Pending', 'Confirmed')),
    'lowStockProducts', (select count(*) from public.products where stock_qty <= low_stock_threshold),
    'totalCustomers', (select count(*) from public.profiles p where p.id not in (select a.id from public.admins a)),
    'pendingReviews', (select count(*) from public.reviews where status = 'Pending'),
    'recentOrders', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', o.id, 'date', o.date, 'customer', o.customer,
            'total', o.total, 'fulfillmentStatus', o.fulfillment_status
          )
          order by o.date desc, o.id desc
        ),
        '[]'::jsonb
      )
      from (
        select id, date, customer, total, fulfillment_status
        from public.orders
        order by date desc, id desc
        limit 5
      ) o
    ),
    'salesData', (
      select coalesce(
        jsonb_agg(jsonb_build_object('date', bucket, 'total', bucket_total) order by bucket),
        '[]'::jsonb
      )
      from (
        select
          case when p_granularity = 'monthly' then to_char(date, 'YYYY-MM') else to_char(date, 'YYYY-MM-DD') end as bucket,
          sum(total) as bucket_total
        from public.orders
        group by 1
      ) s
    )
  )
  into v_result;

  return v_result;
end;
$$;

grant execute on function public.admin_dashboard_stats(text) to authenticated;
