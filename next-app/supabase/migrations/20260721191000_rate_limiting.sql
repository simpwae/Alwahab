-- ============================================================================
-- Generic rate-limit primitive. place_order() and find_guest_order() /
-- find_guest_order_items() are SECURITY DEFINER RPCs granted to `anon` (see
-- place_order_rpc.sql and initial_schema.sql) - callable straight from the
-- browser with no app-server hop in front of them (this app has no Next.js
-- API routes/middleware; every Supabase call comes directly from the
-- client). find_guest_order in particular is only gated by order_id + email,
-- and order_id is a plain sequence (ALW-10235, ALW-10236, ...), so without a
-- limit it's a guessable path to other customers' order details. One shared
-- table + function rather than a bespoke one per RPC.
-- ============================================================================

create table public.rate_limit_hits (
  key text not null,
  created_at timestamptz not null default now()
);

-- ponytail: no cleanup job - rows are cheap and low-volume for a store this
-- size. Add a delete-older-than-24h cron if this table ever grows enough to
-- matter.
create index rate_limit_hits_key_created_at_idx
  on public.rate_limit_hits (key, created_at);

alter table public.rate_limit_hits enable row level security;
-- No policies: only reached via SECURITY DEFINER functions below, never
-- queried directly by anon/authenticated over PostgREST.

create function public.check_rate_limit(p_key text, p_max_count int, p_window interval)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.rate_limit_hits
  where key = p_key and created_at > now() - p_window;

  if v_count >= p_max_count then
    raise exception 'rate_limit_exceeded';
  end if;

  insert into public.rate_limit_hits (key) values (p_key);
end;
$$;

-- Best-effort caller IP for guest (unauthenticated) requests, via the header
-- PostgREST exposes as `request.headers`. Falls back to 'unknown' (grouping
-- all header-less callers into one bucket) rather than erroring, since local
-- psql/CLI testing won't have this header set.
create function public.request_ip()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1), ''),
    'unknown'
  );
$$;
