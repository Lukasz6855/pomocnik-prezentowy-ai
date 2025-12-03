import { NextRequest, NextResponse } from 'next/server';
import { lookupProduct } from '@/lib/ceneoClient';
import type { CeneoLookupResult } from '@/lib/ceneoClient';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Cache dla wyników wyszukiwania produktów Ceneo
 * TTL: 24 godziny
 */
interface CacheEntry {
  data: CeneoLookupResult | null;
  expiresAt: number;
}

const productCache = new Map<string, CacheEntry>();

// Czas życia cache: 24 godziny
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h w milisekundach

/**
 * Pobiera produkt z cache lub wykonuje lookup
 */
async function getCachedProduct(
  query: string,
  priceRange?: { min?: number; max?: number }
): Promise<CeneoLookupResult | null> {
  // Generuj klucz cache (query + opcjonalny zakres cen)
  const cacheKey = `${query.toLowerCase()}|${priceRange?.min || ''}|${priceRange?.max || ''}`;
  
  // Sprawdź cache
  const cached = productCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && cached.expiresAt > now) {
    console.log('[Ceneo Cache] HIT dla:', query);
    return cached.data;
  }

  // Cache miss - pobierz z API
  console.log('[Ceneo Cache] MISS dla:', query);
  const product = await lookupProduct(query, priceRange);
  
  // Zapisz w cache
  productCache.set(cacheKey, {
    data: product,
    expiresAt: now + CACHE_TTL,
  });

  // Cleanup: usuń wygasłe wpisy (max 1000 wpisów w cache)
  if (productCache.size > 1000) {
    const keysToDelete: string[] = [];
    productCache.forEach((entry, key) => {
      if (entry.expiresAt <= now) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => productCache.delete(key));
  }

  return product;
}

/**
 * GET /api/ceneo/lookup
 * 
 * Wyszukuje produkt w Ceneo API i zwraca dane gotowe do wyświetlenia
 * 
 * Query params:
 * - query: nazwa produktu (required)
 * - minPrice: minimalna cena (optional)
 * - maxPrice: maksymalna cena (optional)
 * 
 * Response:
 * {
 *   success: true,
 *   product: {
 *     productId: string,
 *     name: string,
 *     imageUrl: string,
 *     lowestPrice: number,
 *     affiliateUrl: string
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Brak parametru query',
        },
        { status: 400 }
      );
    }

    // Opcjonalne filtry cenowe
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const priceRange = {
      min: minPrice ? parseFloat(minPrice) : undefined,
      max: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    // Pobierz produkt (z cache lub API)
    const product = await getCachedProduct(query, priceRange);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nie znaleziono produktu w Ceneo',
          query,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
      cached: productCache.has(`${query.toLowerCase()}|${priceRange.min || ''}|${priceRange.max || ''}`),
    });

  } catch (error) {
    console.error('[API /ceneo/lookup] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd',
      },
      { status: 500 }
    );
  }
}
