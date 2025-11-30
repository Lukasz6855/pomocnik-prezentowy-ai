// API endpoint do proxowania obrazków z zewnętrznych źródeł
// Chroni przed CORS i pobiera obrazki przez backend
import { NextRequest, NextResponse } from 'next/server';

// Wymuszenie dynamicznego renderowania (potrzebne dla searchParams)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Brak parametru ?url=' },
        { status: 400 }
      );
    }

    // Walidacja URL (tylko https)
    let url: URL;
    try {
      url = new URL(imageUrl);
      if (url.protocol !== 'https:') {
        return NextResponse.json(
          { error: 'Tylko HTTPS jest dozwolone' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Nieprawidłowy URL' },
        { status: 400 }
      );
    }

    // Whitelist domen (opcjonalne zabezpieczenie)
    const allowedDomains = [
      'allegro.pl',
      'allegroimg.com', 
      'static.allegro.pl',
      'a.allegroimg.com',
      'unsplash.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ];

    const isAllowed = allowedDomains.some(domain => 
      url.hostname.endsWith(domain)
    );

    if (!isAllowed) {
      console.warn(`⚠️ Zablokowana domena: ${url.hostname}`);
      return NextResponse.json(
        { error: 'Domena nie jest na whiteliście' },
        { status: 403 }
      );
    }

    console.log(`🖼️ Proxowanie obrazka: ${imageUrl.substring(0, 80)}...`);

    // Pobranie obrazka
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`❌ Błąd pobierania obrazka: ${response.status}`);
      return NextResponse.json(
        { error: `Błąd pobierania obrazka: ${response.status}` },
        { status: response.status }
      );
    }

    // Sprawdzenie typu contentu
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL nie wskazuje na obrazek' },
        { status: 400 }
      );
    }

    // Pobranie danych obrazka
    const imageBuffer = await response.arrayBuffer();

    console.log(`✅ Obrazek pobrany: ${(imageBuffer.byteLength / 1024).toFixed(1)} KB`);

    // Zwrócenie obrazka z odpowiednimi headerami
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache na rok
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('❌ Błąd proxowania obrazka:', error);
    return NextResponse.json(
      { 
        error: 'Błąd proxowania obrazka',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
