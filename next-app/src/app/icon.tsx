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
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'sans-serif',
            lineHeight: 1,
          }}
        >
          A
        </span>
        <div
          style={{
            position: 'absolute',
            right: 3,
            bottom: 3,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: '#F97316',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
