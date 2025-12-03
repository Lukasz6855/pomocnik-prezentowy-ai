// Typy danych używanych w aplikacji

// Link do sklepu
export interface ShopLink {
  shop: string;              // Nazwa sklepu (Ceneo, Allegro, Empik, etc.)
  url: string;               // URL do produktu/wyszukiwarki
  isConcreteOffer: boolean;  // Czy to konkretna oferta (true) czy link do wyszukiwania (false)
}

// Typ dla pojedynczej propozycji prezentu
export interface Prezent {
  title: string;                 // Nazwa prezentu
  description: string;           // Opis prezentu
  why: string;                   // Dlaczego jest odpowiedni
  price_estimate: string;        // Szacunkowa cena
  shop_links?: ShopLink[];       // Lista linków do sklepów (nowy format)
  affiliate_links?: string[];    // Stary format (backward compatibility)
  imageUrl?: string;             // URL miniaturki zdjęcia produktu (opcjonalne)
  
  // Pole źródła oferty
  source?: 'ceneo' | 'allegro' | 'other';  // Źródło oferty
  shopName?: string;                       // Nazwa sklepu (dla source='other')
  ceneoId?: string;                        // ID produktu z Ceneo (jeśli source=ceneo)
  allegroId?: string;                      // ID oferty z Allegro (jeśli source=allegro)
  realImageUrl?: string;                   // Prawdziwy URL obrazka (do proxowania)
}

// Typ dla danych z formularza
export interface DaneFormularza {
  okazja: string;                    // Okazja (urodziny, imieniny, itp.)
  plec: string;                      // Płeć (kobieta, mężczyzna, para)
  wiek: string;                      // Wiek
  budzetOd: string;                  // Budżet od (PLN)
  budzetDo: string;                  // Budżet do (PLN)
}

// Typ dla swobodnego opisu
export interface DaneOpisu {
  opis: string;  // Swobodny opis tekstowy
}

// Typ dla wyniku porównania cen
export interface PorownanieCen {
  sklep: string;       // Nazwa sklepu
  cena: string;        // Cena w PLN
  linkAfiliacyjny: string;  // Link afiliacyjny (mock)
}

// Typ dla artykułu blogowego (stary - do usunięcia po migracji)
export interface ArtykulBlogowy {
  tytul: string;        // Tytuł artykułu
  lead: string;         // Lead/wstęp
  naglowki: string[];   // Lista nagłówków
  tresc: string;        // Pełna treść artykułu w Markdown
}

// Typ dla artykułu blogowego (nowa struktura - wyświetlanie gotowych artykułów)
export interface Article {
  slug: string;           // Unikalny identyfikator URL (np. "najlepsze-prezenty-na-swieta-2025")
  title: string;          // Tytuł artykułu (np. "10 Najlepszych Prezentów na Święta 2025")
  excerpt: string;        // Krótki wstęp/opis artykułu (2-3 zdania, wyświetlane na liście)
  keywords: string[];     // Słowa kluczowe / tagi (np. ["prezenty", "święta", "porady"])
  thumbnail: string;      // URL miniaturki artykułu (np. z Unsplash lub własny obrazek)
  contentMarkdown: string; // Pełna treść artykułu w formacie Markdown
  date: string;           // Data publikacji w formacie ISO (np. "2025-11-29")
  author?: string;        // Autor artykułu (opcjonalne)
  metaDescription?: string; // Opis SEO (opcjonalne, domyślnie excerpt)
}
