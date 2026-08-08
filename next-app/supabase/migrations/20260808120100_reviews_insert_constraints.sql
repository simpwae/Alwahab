-- reviews_insert_authenticated previously only checked auth.uid() is not
-- null, with no constraint on the row's own columns. Any signed-in user
-- could POST directly to PostgREST with status: 'Approved',
-- verified_purchase: true, and any product_id/customer name - self-
-- publishing fake verified reviews with no moderation. There's no review
-- form in the UI (ProductTabs.tsx's "Write a Review" is a dead button,
-- hasPurchased is hardcoded false), so this was pure exposure with no
-- legitimate caller relying on the old shape.
drop policy "reviews_insert_authenticated" on public.reviews;

create policy "reviews_insert_authenticated" on public.reviews
  for insert
  with check (
    auth.uid() is not null
    and status = 'Pending'
    and verified_purchase = false
  );
