// Helper do generowania linków wyszukiwania w sklepach bez API
// Dla Vistula, Reserved, Empik, Smyk, Douglas, etc.

interface ShopConfig {
  name: string;
  searchUrlTemplate: string;  // Template z {{query}} placeholder
  categories?: string[];      // Opcjonalne kategorie które obsługuje sklep
}

// Konfiguracja sklepów bez API
const SHOPS_WITHOUT_API: Record<string, ShopConfig> = {
  vistula: {
    name: 'Vistula',
    searchUrlTemplate: 'https://vistula.pl/szukaj?query={{query}}',
    categories: ['koszula', 'garnitur', 'marynarka', 'spodnie', 'krawat', 'moda męska'],
  },
  reserved: {
    name: 'Reserved',
    searchUrlTemplate: 'https://reserved.com/pl/pl/search?q={{query}}',
    categories: ['koszulka', 'bluza', 'spodnie', 'sukienka', 'kurtka', 'odzież'],
  },
  empik: {
    name: 'Empik',
    searchUrlTemplate: 'https://empik.com/szukaj/produkt?q={{query}}',
    categories: ['książka', 'gra', 'film', 'muzyka', 'zabawka', 'artykuły papiernicze'],
  },
  smyk: {
    name: 'Smyk',
    searchUrlTemplate: 'https://smyk.com/search?q={{query}}',
    categories: ['zabawka', 'lego', 'gra', 'puzzle', 'lalka', 'samochód', 'pluszak'],
  },
  douglas: {
    name: 'Douglas',
    searchUrlTemplate: 'https://douglas.pl/pl/search?query={{query}}',
    categories: ['perfumy', 'kosmetyki', 'makijaż', 'zapach', 'krem'],
  },
  pepco: {
    name: 'Pepco',
    searchUrlTemplate: 'https://pepco.pl/szukaj?q={{query}}',
    categories: ['dekoracje', 'dom', 'ogród', 'tekstylia', 'prezent'],
  },
  morele: {
    name: 'Morele.net',
    searchUrlTemplate: 'https://morele.net/wyszukiwarka/?q={{query}}',
    categories: ['elektronika', 'laptop', 'telefon', 'tablet', 'komputer', 'akcesoria'],
  },
  mediaexpert: {
    name: 'Media Expert',
    searchUrlTemplate: 'https://mediaexpert.pl/search?query[menu]=&query[querystring]={{query}}',
    categories: ['AGD', 'RTV', 'laptop', 'smartfon', 'telewizor', 'pralka'],
  },
};

/**
 * Generuje link do wyszukiwania produktu w sklepie bez API
 */
export function generateShopSearchLink(shopKey: string, productQuery: string): string | null {
  const shop = SHOPS_WITHOUT_API[shopKey];
  if (!shop) {
    console.warn(`⚠️ Nieznany sklep: ${shopKey}`);
    return null;
  }

  // Enkodowanie query dla URL
  const encodedQuery = encodeURIComponent(productQuery.trim());
  
  // Zastąpienie {{query}} w template
  const searchUrl = shop.searchUrlTemplate.replace('{{query}}', encodedQuery);
  
  return searchUrl;
}

/**
 * Znajduje najbardziej odpowiedni sklep dla danej kategorii produktu
 */
export function findBestShopForCategory(productDescription: string): string | null {
  const lowerDesc = productDescription.toLowerCase();
  
  // Sprawdzenie każdego sklepu
  for (const [shopKey, shopConfig] of Object.entries(SHOPS_WITHOUT_API)) {
    if (!shopConfig.categories) continue;
    
    // Czy jakąkolwiek kategoria pasuje do opisu
    const matches = shopConfig.categories.some(category => 
      lowerDesc.includes(category.toLowerCase())
    );
    
    if (matches) {
      return shopKey;
    }
  }
  
  return null;
}

/**
 * Zwraca konfigurację sklepu
 */
export function getShopConfig(shopKey: string): ShopConfig | null {
  return SHOPS_WITHOUT_API[shopKey] || null;
}

/**
 * Zwraca listę wszystkich sklepów bez API
 */
export function getAllShopsWithoutAPI(): ShopConfig[] {
  return Object.values(SHOPS_WITHOUT_API);
}

/**
 * Generuje propozycję prezentu dla sklepu bez API
 * (do użycia przez AI - generuje tylko kategorię, nie konkretny model)
 */
export function createOtherShopProposal(
  shopKey: string,
  productCategory: string,
  description: string,
  why: string,
  priceEstimate: string
) {
  const shop = SHOPS_WITHOUT_API[shopKey];
  if (!shop) return null;

  const searchLink = generateShopSearchLink(shopKey, productCategory);
  if (!searchLink) return null;

  return {
    title: `${productCategory} - ${shop.name}`,
    description,
    why,
    price_estimate: priceEstimate,
    affiliate_links: [searchLink],
    source: 'other' as const,
    shopName: shop.name,
    imageUrl: undefined, // Brak obrazka dla sklepów bez API
  };
}
