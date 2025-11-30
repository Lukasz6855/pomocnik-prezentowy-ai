// Klient Allegro REST API
// Dokumentacja: https://developer.allegro.pl/documentation/

/**
 * Typ dla tokenu OAuth2 Allegro
 */
interface AllegroToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
  jti?: string;
}

/**
 * Typ dla oferty z Allegro API
 */
export interface AllegroOffer {
  id: string;
  name: string;
  seller: {
    id: string;
    login?: string;
  };
  delivery?: {
    lowestPrice?: {
      amount: string;
      currency: string;
    };
  };
  sellingMode: {
    format: string;
    price: {
      amount: string;
      currency: string;
    };
  };
  stock?: {
    available: number;
    sold: number;
  };
  images?: Array<{
    url: string;
  }>;
  category?: {
    id: string;
    name?: string;
  };
  description?: string;
  parameters?: Array<{
    id: string;
    name?: string;
    values?: string[];
  }>;
}

/**
 * Typ dla wyników wyszukiwania
 */
export interface AllegroSearchResult {
  items: {
    promoted: AllegroOffer[];
    regular: AllegroOffer[];
  };
  count: number;
  totalCount: number;
}

/**
 * Klasa obsługująca komunikację z Allegro API
 */
class AllegroClient {
  private clientId: string;
  private clientSecret: string;
  private apiUrl: string;
  private authUrl: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    this.clientId = process.env.ALLEGRO_CLIENT_ID || '';
    this.clientSecret = process.env.ALLEGRO_CLIENT_SECRET || '';
    this.apiUrl = process.env.ALLEGRO_API_URL || 'https://api.allegro.pl';
    this.authUrl = process.env.ALLEGRO_AUTH_URL || 'https://allegro.pl/auth/oauth/token';

    if (!this.clientId || !this.clientSecret) {
      console.warn('⚠️ Allegro API credentials not configured. Please set ALLEGRO_CLIENT_ID and ALLEGRO_CLIENT_SECRET in .env.local');
    }
  }

  /**
   * Pobiera token OAuth2 z Allegro (Client Credentials Flow)
   * https://developer.allegro.pl/auth/#tag/authorization/paths/~1auth~1oauth~1token/post
   */
  async getAccessToken(): Promise<string> {
    // Jeśli mamy ważny token, zwracamy go
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    console.log('🔐 Pobieranie nowego tokenu Allegro...');

    // Kodowanie credentials do Base64
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Allegro auth failed: ${response.status} ${error}`);
    }

    const data: AllegroToken = await response.json();
    
    this.accessToken = data.access_token;
    // Ustawiamy wygaśnięcie z 5 min buforem
    this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

    console.log('✅ Token Allegro otrzymany');
    return this.accessToken;
  }

  /**
   * Wyszukuje oferty w Allegro
   * https://developer.allegro.pl/documentation/#tag/Offers-and-listings/paths/~1offers~1listing/get
   * 
   * @param params - Parametry wyszukiwania
   */
  async searchOffers(params: {
    phrase?: string;           // Fraza wyszukiwania
    category?: string;         // ID kategorii
    priceFrom?: number;        // Cena minimalna
    priceTo?: number;          // Cena maksymalna
    limit?: number;            // Limit wyników (max 60)
    offset?: number;           // Offset (paginacja)
    sort?: string;             // Sortowanie: -price, price, -popularity, relevance
  }): Promise<AllegroSearchResult> {
    const token = await this.getAccessToken();

    // Budowanie query params
    const queryParams = new URLSearchParams();
    
    if (params.phrase) queryParams.append('phrase', params.phrase);
    if (params.category) queryParams.append('category.id', params.category);
    if (params.priceFrom) queryParams.append('sellingMode.price.gte', params.priceFrom.toString());
    if (params.priceTo) queryParams.append('sellingMode.price.lte', params.priceTo.toString());
    queryParams.append('limit', (params.limit || 20).toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    queryParams.append('sort', params.sort || '-popularity');

    const url = `${this.apiUrl}/offers/listing?${queryParams.toString()}`;

    console.log('🔍 Wyszukiwanie w Allegro:', params.phrase);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.allegro.public.v1+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Allegro search failed: ${response.status} ${error}`);
    }

    const data: AllegroSearchResult = await response.json();
    
    console.log(`✅ Znaleziono ${data.count} ofert w Allegro`);
    return data;
  }

  /**
   * Pobiera szczegóły oferty
   * https://developer.allegro.pl/documentation/#tag/Offers-and-listings/paths/~1sale~1offers~1{offerId}/get
   */
  async getOfferDetails(offerId: string): Promise<AllegroOffer> {
    const token = await this.getAccessToken();

    const url = `${this.apiUrl}/sale/offers/${offerId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.allegro.public.v1+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Allegro offer details failed: ${response.status} ${error}`);
    }

    const data: AllegroOffer = await response.json();
    return data;
  }

  /**
   * Konwertuje ofertę Allegro do formatu używanego w aplikacji
   */
  convertToAppFormat(offer: AllegroOffer) {
    return {
      id: offer.id,
      title: offer.name,
      description: offer.description || `Oferta z Allegro: ${offer.name}`,
      price_estimate: `${offer.sellingMode.price.amount} ${offer.sellingMode.price.currency}`,
      affiliate_links: [`https://allegro.pl/oferta/${offer.id}`],
      imageUrl: offer.images?.[0]?.url || null,
      source: 'allegro' as const,
      shopName: 'Allegro',
      allegroId: offer.id,
    };
  }

  /**
   * Sprawdza czy API jest skonfigurowane
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

// Singleton instancja
const allegroClient = new AllegroClient();

export default allegroClient;
