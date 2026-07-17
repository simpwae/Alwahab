-- admin_list_customers() returned every profiles row, including admins
-- themselves (handle_new_user() creates a profiles row for every signup,
-- admin accounts included) - a "Customers" screen shouldn't list admins.

create or replace function public.admin_list_customers()
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
    where p.id not in (select id from public.admins)
    order by p.joined_date desc;
end;
$$;
