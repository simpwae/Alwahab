// One-off migration: re-hosts product images that live on third-party
// supplier domains (sonex-nonstick.com, cdn.shopify.com, kingbazar.pk,
// action.pk, a DigitalOcean Spaces bucket) onto Cloudinary, so they stop
// being silently blocked by the app's CSP img-src allowlist (which only
// permits res.cloudinary.com).
//
// Usage:
//   node --env-file-if-exists=.env.local scripts/migrate-product-images.mjs         (dry run, no writes)
//   node --env-file-if-exists=.env.local scripts/migrate-product-images.mjs --apply (uploads + updates DB)

import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.');
  process.exit(1);
}
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in the environment.');
  console.error('Fill these into .env.local (matching Vercel Production) before running this script.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function isCloudinaryUrl(url) {
  try {
    return new URL(url).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

async function reuploadToCloudinary(sourceUrl) {
  const downloadRes = await fetch(sourceUrl);
  if (!downloadRes.ok) {
    throw new Error(`download failed: HTTP ${downloadRes.status}`);
  }
  const blob = await downloadRes.blob();

  const body = new FormData();
  body.append('file', blob);
  body.append('upload_preset', UPLOAD_PRESET);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(`Cloudinary upload failed: ${data.error?.message ?? uploadRes.status}`);
  }
  return data.secure_url;
}

async function main() {
  const { data: products, error } = await supabase.from('products').select('id, name, images');
  if (error) {
    console.error('Failed to fetch products:', error.message);
    process.exit(1);
  }

  console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} — scanning ${products.length} products...\n`);

  let migratedImages = 0;
  let failedImages = 0;

  for (const product of products) {
    const images = product.images ?? [];
    const externalIdxs = images
      .map((url, i) => ({ url, i }))
      .filter(({ url }) => url && !isCloudinaryUrl(url));

    if (externalIdxs.length === 0) continue;

    console.log(`Product ${product.id} (${product.name}) — ${externalIdxs.length} external image(s)`);
    const newImages = [...images];
    let changed = false;

    for (const { url, i } of externalIdxs) {
      console.log(`  [${i}] ${url}`);
      if (!APPLY) continue;
      try {
        const newUrl = await reuploadToCloudinary(url);
        newImages[i] = newUrl;
        changed = true;
        migratedImages += 1;
        console.log(`      -> ${newUrl}`);
      } catch (err) {
        failedImages += 1;
        console.error(`      FAILED: ${err.message} (left original URL in place)`);
      }
    }

    if (APPLY && changed) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id);
      if (updateError) {
        console.error(`  FAILED to save product ${product.id}: ${updateError.message}`);
      } else {
        console.log(`  saved.`);
      }
    }
  }

  console.log(`\nDone. ${migratedImages} image(s) migrated, ${failedImages} failed.`);
  if (!APPLY) {
    console.log('This was a dry run — re-run with --apply to actually upload and save.');
  }
}

main();
