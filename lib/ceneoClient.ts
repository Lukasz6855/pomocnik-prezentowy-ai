/**
 * Ceneo API Client
 * Dokumentacja: https://partnerzyapi.ceneo.pl/Help/Service?name=PartnerService
 * 
 * Używa OAuth 2.0 (client_credentials) z Bearer token
 */

// Interfejsy dla API Ceneo
export interface CeneoProduct {
  Id: number;
  Name: string;
  CategoryId: number;
  LowestPrice: number;
  HighestPrice: number;
  BasketPrice: number | null;
  Shops: number;
  Rating: number;
  ProductReviews: number;
  ManufacturerName: string;
  HasBasketOffers: boolean;
  Popularity: number;
  Url: string;
  ThumbnailUrl: string;
  MediumThumbnailUrl: string;
  SmallThumbnailUrl: string;
}

export interface CeneoApiResponse {
  d: {
    results: CeneoProduct[];
  };
}

export interface CeneoTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface CeneoLookupResult {
  productId: string;
  name: string;
  imageUrl: string;
  lowestPrice: number;
  affiliateUrl: string;
}

// Partner ID (z ustawień programu partnerskiego)
const CENEO_PARTNER_ID = process.env.CENEO_PARTNER_ID || '';

// Cache dla tokenu OAuth (token ważny przez 15 minut według dokumentacji)
let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Pobiera access token z Ceneo API używając OAuth 2.0
 * Token jest cachowany i odświeżany automatycznie
 */
async function getAccessToken(): Promise<string> {
  const apiKey = process.env.CENEO_API_KEY;
  
  if (!apiKey) {
    throw new Error('CENEO_API_KEY nie jest ustawiony w zmiennych środowiskowych');
  }

  // Sprawdź czy mamy ważny token w cache (dodaj 60s buffer)
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  // Pobierz nowy token
  try {
    const authUrl = "https://partnerzyapi.ceneo.pl/AuthorizationService.svc/GetToken?grantType='client_credentials'";
    console.log('[Ceneo] Pobieranie tokenu OAuth z:', authUrl);
    
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${apiKey}`,
      },
    });

    console.log('[Ceneo] Status odpowiedzi tokenu:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Ceneo] Błąd OAuth - odpowiedź:', errorText);
      throw new Error(`Ceneo OAuth failed (${response.status}): ${errorText}`);
    }

    // Token jest w headerach odpowiedzi
    const accessToken = response.headers.get('access_token');
    const expiresIn = response.headers.get('expires_in');
    const tokenType = response.headers.get('token_type');
    
    console.log('[Ceneo] Headery odpowiedzi:', {
      accessToken: accessToken ? 'PRESENT' : 'MISSING',
      expiresIn,
      tokenType,
      allHeaders: Array.from(response.headers.entries()),
    });

    if (!accessToken || !expiresIn) {
      throw new Error('Brak tokenu w odpowiedzi Ceneo API');
    }

    console.log('[Ceneo] Nowy token OAuth otrzymany:', {
      tokenType,
      expiresIn: `${expiresIn}s`,
    });

    // Cachuj token (expires_in to sekundy, konwertuj na milisekundy)
    cachedToken = {
      token: accessToken,
      expiresAt: now + parseInt(expiresIn) * 1000,
    };

    return accessToken;
  } catch (error) {
    console.error('[Ceneo] Błąd pobierania tokenu:', error);
    throw error;
  }
}

/**
 * Generuje link afiliacyjny Ceneo z Partner ID
 * Format: URL#pid=PARTNER_ID
 */
export function generateAffiliateUrl(productUrl: string): string {
  // Usuń istniejące #pid jeśli jest
  const cleanUrl = productUrl.split('#')[0];
  return `${cleanUrl}#pid=${CENEO_PARTNER_ID}`;
}

/**
 * Wyszukuje produkt w Ceneo API
 * 
 * @param searchText - Fraza do wyszukania (nazwa produktu)
 * @param options - Opcje filtrowania (cena, kategoria, etc.)
 * @returns Lista produktów z Ceneo
 */
export async function searchProducts(
  searchText: string,
  options?: {
    categoryId?: number;
    highestPrice?: number;
    pageSize?: number;
  }
): Promise<CeneoProduct[]> {
  const token = await getAccessToken();

  // Buduj URL z parametrami OData
  // UWAGA: OData wymaga wartości tekstowych w pojedynczych cudzysłowach!
  const params: string[] = [];
  
  // searchtext - MUSI być w cudzysłowach (OData string literal)
  params.push(`searchtext='${encodeURIComponent(searchText)}'`);
  
  if (options?.categoryId) {
    params.push(`categoryId=${options.categoryId}`);
  }
  // UWAGA: Ceneo API nie ma parametru lowestPrice, tylko highestPrice
  if (options?.highestPrice) {
    params.push(`highestPrice=${options.highestPrice}m`);
  }
  if (options?.pageSize) {
    params.push(`pageSize=${options.pageSize}`);
  }

  // Sortuj po popularności (najbardziej popularne najpierw)
  params.push('$orderby=Popularity%20asc');
  
  // Format JSON (domyślnie zwraca XML)
  params.push('$format=json');

  const url = `https://partnerzyapi.ceneo.pl/PartnerService.svc/GetProducts?${params.join('&')}`.replace(/ /g, '%20');
  
  console.log('[Ceneo] Wyszukiwanie produktów:', {
    searchText,
    url,
    token: token ? `Bearer ${token.substring(0, 20)}...` : 'BRAK',
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log('[Ceneo] Status odpowiedzi produktów:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Ceneo] Błąd API - odpowiedź:', errorText);
      throw new Error(`Ceneo API error (${response.status}): ${errorText}`);
    }

    const data: CeneoApiResponse = await response.json();
    
    console.log('[Ceneo] Otrzymano odpowiedź:', {
      hasResults: !!data.d?.results,
      resultsType: typeof data.d?.results,
      productsCount: Array.isArray(data.d?.results) ? data.d.results.length : 'NOT_ARRAY',
      firstProduct: data.d?.results?.[0] ? { id: data.d.results[0].Id, name: data.d.results[0].Name } : null,
      rawData: JSON.stringify(data).substring(0, 500),
    });
    
    console.log('[Ceneo] Znaleziono produktów:', data.d?.results?.length || 0, 'dla:', searchText);
    
    return data.d?.results || [];
  } catch (error) {
    console.error('[Ceneo] Błąd wyszukiwania produktów:', error);
    throw error;
  }
}

/**
 * Znajduje najlepiej pasujący produkt dla danej frazy
 * (najwyższy rating + najwięcej opinii + najniższa popularność)
 * 
 * @param searchText - Nazwa produktu do wyszukania
 * @returns Sformatowany wynik gotowy do użycia w aplikacji
 */
export async function lookupProduct(
  searchText: string,
  priceRange?: { min?: number; max?: number }
): Promise<CeneoLookupResult | null> {
  try {
    const products = await searchProducts(searchText, {
      highestPrice: priceRange?.max,
      pageSize: 10, // Pobierz top 10 dla wyboru najlepszego
    });

    if (!products || products.length === 0) {
      console.log('[Ceneo] Brak wyników dla:', searchText);
      return null;
    }

    // Wybierz najlepszy produkt:
    // 1. Popularity asc (1 = top 10, 2 = top 30, 3 = top 100, 4 = poza top 100)
    // 2. Najwyższy rating
    // 3. Najwięcej opinii
    const bestProduct = products.reduce((best, current) => {
      // Porównaj popularność (niższa wartość = bardziej popularny)
      if (current.Popularity < best.Popularity) return current;
      if (current.Popularity > best.Popularity) return best;
      
      // Przy tej samej popularności, wybierz wyższy rating
      if (current.Rating > best.Rating) return current;
      if (current.Rating < best.Rating) return best;
      
      // Przy tym samym ratingu, wybierz więcej opinii
      if (current.ProductReviews > best.ProductReviews) return current;
      return best;
    });

    console.log('[Ceneo] Wybrany produkt:', {
      id: bestProduct.Id,
      name: bestProduct.Name,
      price: bestProduct.LowestPrice,
      rating: bestProduct.Rating,
      popularity: bestProduct.Popularity,
    });

    return {
      productId: bestProduct.Id.toString(),
      name: bestProduct.Name,
      imageUrl: bestProduct.ThumbnailUrl, // 245x224
      lowestPrice: bestProduct.LowestPrice,
      affiliateUrl: generateAffiliateUrl(bestProduct.Url),
    };
  } catch (error) {
    console.error('[Ceneo] Błąd lookup produktu:', error);
    return null;
  }
}
