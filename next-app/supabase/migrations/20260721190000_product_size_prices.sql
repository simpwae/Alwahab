-- Sizes were plain labels (text[]) with no way to price a size differently
-- (e.g. a bigger size costing more) - switch to jsonb so each size carries
-- its own { label, price }. Existing labels (added same-day, before any
-- admin had a chance to rely on the old shape) are backfilled to the
-- product's current selling_price.
--
-- ALTER COLUMN ... TYPE ... USING can't contain a correlated subquery
-- (jsonb_agg over unnest(sizes) needs one), so this goes via a staging
-- column + UPDATE instead of a single in-place USING expression.

alter table public.products add column sizes_jsonb jsonb not null default '[]'::jsonb;

update public.products
set sizes_jsonb = coalesce(
  (select jsonb_agg(jsonb_build_object('label', s, 'price', selling_price))
   from unnest(sizes) as s),
  '[]'::jsonb
);

alter table public.products drop column sizes;
alter table public.products rename column sizes_jsonb to sizes;
