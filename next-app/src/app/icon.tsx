import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0E7C6B',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            background: '#fff',
            clipPath: 'polygon(50% 0%, 100% 100%, 73% 100%, 50% 55%, 27% 100%, 0% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 3,
            bottom: 3,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: '#F97316',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
