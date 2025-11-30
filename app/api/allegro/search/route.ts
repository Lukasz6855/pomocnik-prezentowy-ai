// API endpoint do wyszukiwania ofert w Allegro
import { NextRequest, NextResponse } from 'next/server';
import allegroClient from '@/lib/allegroClient';

export async function POST(request: NextRequest) {
  try {
    // Sprawdzenie czy Allegro API jest skonfigurowane
    if (!allegroClient.isConfigured()) {
      return NextResponse.json(
        { 
          error: 'Allegro API nie jest skonfigurowane',
          message: 'Ustaw ALLEGRO_CLIENT_ID i ALLEGRO_CLIENT_SECRET w .env.local'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      phrase,           // Fraza wyszukiwania (np. "książka fantasy")
      category,         // ID kategorii (opcjonalne)
      priceFrom,        // Cena minimalna
      priceTo,          // Cena maksymalna
      limit = 20,       // Limit wyników (domyślnie 20)
      sort = '-popularity'  // Sortowanie (domyślnie po popularności)
    } = body;

    if (!phrase) {
      return NextResponse.json(
        { error: 'Brak frazy wyszukiwania (phrase)' },
        { status: 400 }
      );
    }

    console.log('🔍 Wyszukiwanie w Allegro API:', { phrase, priceFrom, priceTo, limit });

    // Wywołanie Allegro API
    const result = await allegroClient.searchOffers({
      phrase,
      category,
      priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
      priceTo: priceTo ? parseFloat(priceTo) : undefined,
      limit: Math.min(limit, 60), // Max 60 według dokumentacji Allegro
      sort,
    });

    // Łączenie promoted i regular offers
    const allOffers = [
      ...result.items.promoted,
      ...result.items.regular,
    ];

    // Konwersja ofert do formatu aplikacji
    const convertedOffers = allOffers.map(offer => 
      allegroClient.convertToAppFormat(offer)
    );

    console.log(`✅ Zwracam ${convertedOffers.length} ofert z Allegro`);

    return NextResponse.json({
      success: true,
      count: convertedOffers.length,
      totalCount: result.totalCount,
      offers: convertedOffers,
    });

  } catch (error: any) {
    console.error('❌ Błąd wyszukiwania Allegro:', error);
    return NextResponse.json(
      { 
        error: 'Błąd wyszukiwania w Allegro',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Endpoint GET dla testowania
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phrase = searchParams.get('phrase');

  if (!phrase) {
    return NextResponse.json(
      { error: 'Brak parametru ?phrase=' },
      { status: 400 }
    );
  }

  // Przekierowanie do POST
  const req = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      phrase,
      limit: 10 
    }),
  });

  return POST(req as any);
}
