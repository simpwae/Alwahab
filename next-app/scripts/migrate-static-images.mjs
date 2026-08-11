// One-off migration: re-hosts the hardcoded Unsplash URLs used by the
// homepage hero carousel and category tiles onto Cloudinary, so they aren't
// silently blocked by the app's CSP img-src allowlist (which only permits
// res.cloudinary.com). Prints a URL mapping to paste into
// src/components/home/HeroCarousel.tsx and CategoryTiles.tsx.
//
// Usage:
//   node --env-file-if-exists=.env.local scripts/migrate-static-images.mjs

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in the environment.');
  process.exit(1);
}

const URLS = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
  'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=1000&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
  'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=300&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80',
  'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300&q=80',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80',
];

async function reuploadToCloudinary(sourceUrl) {
  const downloadRes = await fetch(sourceUrl);
  if (!downloadRes.ok) throw new Error(`download failed: HTTP ${downloadRes.status}`);
  const blob = await downloadRes.blob();

  const body = new FormData();
  body.append('file', blob);
  body.append('upload_preset', UPLOAD_PRESET);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(`Cloudinary upload failed: ${data.error?.message ?? uploadRes.status}`);
  return data.secure_url;
}

async function main() {
  const mapping = {};
  for (const url of URLS) {
    process.stdout.write(`${url} ... `);
    try {
      const newUrl = await reuploadToCloudinary(url);
      mapping[url] = newUrl;
      console.log(newUrl);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
  console.log('\n--- mapping.json ---');
  console.log(JSON.stringify(mapping, null, 2));
}

main();
