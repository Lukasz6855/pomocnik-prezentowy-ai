import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        {/* Tło gradient */}
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Zaokrąglone tło */}
        <rect width="64" height="64" rx="12" fill="url(#bg)" />
        
        {/* Prezent - pudełko */}
        <rect x="18" y="28" width="28" height="24" rx="2" fill="#fff" opacity="0.9" />
        
        {/* Wstążka pionowa */}
        <rect x="30" y="28" width="4" height="24" fill="#667eea" />
        
        {/* Wstążka pozioma */}
        <rect x="18" y="38" width="28" height="4" fill="#764ba2" />
        
        {/* Kokarda - lewy łuk */}
        <circle cx="26" cy="20" r="6" fill="#ff6b9d" opacity="0.8" />
        
        {/* Kokarda - prawy łuk */}
        <circle cx="38" cy="20" r="6" fill="#ff6b9d" opacity="0.8" />
        
        {/* Kokarda - środek */}
        <circle cx="32" cy="18" r="4" fill="#ff1744" />
        
        {/* Iskierka AI */}
        <circle cx="48" cy="16" r="2" fill="#ffd700" />
        <circle cx="52" cy="20" r="1.5" fill="#ffd700" opacity="0.7" />
      </svg>
    ),
    {
      ...size,
    }
  );
}
