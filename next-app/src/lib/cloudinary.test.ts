import { describe, it, expect } from 'vitest';
import { validateReceiptFile, cloudinaryUrl } from './cloudinary';

function makeFile(type: string, sizeBytes: number): File {
  return new File([new Uint8Array(sizeBytes)], 'receipt', { type });
}

describe('validateReceiptFile', () => {
  it('accepts a small jpeg/png/webp', () => {
    expect(validateReceiptFile(makeFile('image/jpeg', 1024))).toBeNull();
    expect(validateReceiptFile(makeFile('image/png', 1024))).toBeNull();
    expect(validateReceiptFile(makeFile('image/webp', 1024))).toBeNull();
  });

  it('rejects disallowed mime types', () => {
    expect(validateReceiptFile(makeFile('application/pdf', 1024))).not.toBeNull();
    expect(validateReceiptFile(makeFile('text/html', 1024))).not.toBeNull();
  });

  it('rejects files over 5MB', () => {
    expect(validateReceiptFile(makeFile('image/jpeg', 6 * 1024 * 1024))).not.toBeNull();
  });

  it('accepts a file right at the 5MB boundary', () => {
    expect(validateReceiptFile(makeFile('image/jpeg', 5 * 1024 * 1024))).toBeNull();
  });
});

describe('cloudinaryUrl', () => {
  it('inserts f_auto,q_auto,w_ right after /image/upload/', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1234/product.jpg';
    expect(cloudinaryUrl(url, { width: 400 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/v1234/product.jpg'
    );
  });

  it('passes through non-Cloudinary URLs unchanged', () => {
    expect(cloudinaryUrl('https://example.com/foo.jpg', { width: 400 })).toBe('https://example.com/foo.jpg');
  });

  it('passes through empty/nullish input unchanged', () => {
    expect(cloudinaryUrl('', { width: 400 })).toBe('');
    expect(cloudinaryUrl(undefined, { width: 400 })).toBe('');
    expect(cloudinaryUrl(null, { width: 400 })).toBe('');
  });
});
