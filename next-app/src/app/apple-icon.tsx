import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
        }}
      >
        <span
          style={{
            fontSize: 113,
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
            right: 17,
            bottom: 17,
            width: 34,
            height: 34,
            borderRadius: 17,
            background: '#F97316',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
