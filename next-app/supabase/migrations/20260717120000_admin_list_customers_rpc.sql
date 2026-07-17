-- ============================================================================
-- admin_list_customers() RPC: profiles has no email column (it lives in
-- auth.users, which isn't exposed through the API) - this joins the two so
-- the admin Customers screen can show real accounts instead of static mock
-- data. profiles_select_own_or_admin already lets an admin SELECT every row,
-- but that RLS policy can't reach across into auth.users, hence the RPC.
-- ============================================================================

create function public.admin_list_customers()
returns table (
  id uuid,
  name text,
  phone text,
  joined_date date,
  email text
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
    select p.id, p.name, p.phone, p.joined_date, u.email::text
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.joined_date desc;
end;
$$;

grant execute on function public.admin_list_customers() to authenticated;
