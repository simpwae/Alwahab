-- Previous version's "where p.id not in (select id from public.admins)" was
-- ambiguous: the returns-table output column is also named "id", and
-- PL/pgSQL can't tell it apart from admins.id inside the subquery.

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
    where p.id not in (select a.id from public.admins a)
    order by p.joined_date desc;
end;
$$;
