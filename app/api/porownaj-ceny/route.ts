// API endpoint do porównywania cen (mock dla MVP)
import { NextRequest, NextResponse } from 'next/server';
import { generujPorownanieCen } from '@/lib/affiliate';

// Handler dla żądań POST
export async function POST(request: NextRequest) {
  try {
    // Pobieranie nazwy produktu z body żądania
    const body = await request.json();
    const { nazwaProduktu } = body;
    
    // Walidacja danych wejściowych
    if (!nazwaProduktu || typeof nazwaProduktu !== 'string') {
      return NextResponse.json(
        { error: 'Brak nazwy produktu' },
        { status: 400 }
      );
    }
    
    // Generowanie mockowych danych porównania cen
    const porownanie = generujPorownanieCen(nazwaProduktu);
    
    // Symulacja opóźnienia API (realistyczne zachowanie)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Zwrócenie wyników
    return NextResponse.json({
      success: true,
      produkt: nazwaProduktu,
      porownanie: porownanie,
      uwaga: 'To są przykładowe dane. W pełnej wersji zostaną zastąpione prawdziwymi cenami.'
    });
    
  } catch (error) {
    // Obsługa błędów
    console.error('Błąd w API /api/porownaj-ceny:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas pobierania cen',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
}
