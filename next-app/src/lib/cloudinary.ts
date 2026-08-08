const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Inserts Cloudinary delivery transforms (auto format/quality, capped
 * width) into an existing secure_url. uploadToCloudinary() stores the raw
 * secure_url with no transforms, so without this every image - including a
 * multi-MB phone photo - is served at full original resolution into
 * whatever UI slot renders it (a 96px cart thumbnail included).
 *
 * Only rewrites recognizable Cloudinary /image/upload/ URLs; anything else
 * (empty string, a non-Cloudinary URL) passes through unchanged.
 */
export function cloudinaryUrl(url: string | undefined | null, opts: { width: number }): string {
  if (!url) return url ?? '';
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}f_auto,q_auto,w_${opts.width}/${url.slice(insertAt)}`;
}

export function validateReceiptFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, or WEBP image.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'File is too large. Please upload an image under 5MB.';
  }
  return null;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const validationError = validateReceiptFile(file);
  if (validationError) throw new Error(validationError);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset!);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed');
  return data.secure_url as string;
}
