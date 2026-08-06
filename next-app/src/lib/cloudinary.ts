export async function uploadToCloudinary(file: File): Promise<string> {
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
