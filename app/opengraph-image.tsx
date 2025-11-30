import { ImageResponse } from 'next/og';

// Konfiguracja generatora obrazka Open Graph
export const runtime = 'edge';
export const alt = 'Pomocnik Prezentowy AI - Znajdź Idealny Prezent';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Generator obrazka OG
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Dekoracyjne elementy */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 50,
            fontSize: 120,
            opacity: 0.3,
          }}
        >
          🎁
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 50,
            fontSize: 100,
            opacity: 0.3,
          }}
        >
          ✨
        </div>
        
        {/* Główna treść */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 100px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            🎁 Pomocnik Prezentowy AI
          </h1>
          <p
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.95)',
              margin: '30px 0 0 0',
              fontWeight: 500,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            Znajdź idealny prezent w 30 sekund
          </p>
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
              margin: '20px 0 0 0',
            }}
          >
            Spersonalizowane propozycje dzięki AI
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
