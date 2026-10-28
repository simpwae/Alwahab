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
        <div
          style={{
            width: 98,
            height: 98,
            background: '#fff',
            clipPath: 'polygon(50% 0%, 100% 100%, 73% 100%, 50% 55%, 27% 100%, 0% 100%)',
          }}
        />
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
