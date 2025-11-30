// Typy danych używanych w aplikacji

// Typ dla pojedynczej propozycji prezentu
export interface Prezent {
  title: string;              // Nazwa prezentu
  description: string;        // Opis prezentu
  why: string;                // Dlaczego jest odpowiedni
  price_estimate: string;     // Szacunkowa cena
  affiliate_links: string[];  // Lista linków afiliacyjnych
  imageUrl?: string;          // URL miniaturki zdjęcia produktu (opcjonalne)
  
  // Nowe pola dla integracji Allegro
  source?: 'allegro' | 'other';  // Źródło oferty
  shopName?: string;             // Nazwa sklepu (Allegro, Vistula, Reserved, etc.)
  allegroId?: string;            // ID oferty z Allegro (jeśli source=allegro)
  realImageUrl?: string;         // Prawdziwy URL obrazka (do proxowania)
}

// Typ dla danych z formularza
export interface DaneFormularza {
  okazja: string;                    // Okazja (urodziny, imieniny, itp.)
  plec: string;                      // Płeć (kobieta, mężczyzna, para)
  relacja: string;                   // Relacja z osobą
  wiek: string;                      // Wiek lub rocznica
  zainteresowania: string[];         // Lista zainteresowań
  stylPrezentu: string;              // Styl prezentu
  formaPrezentu: string[];           // Forma prezentu (może być wiele)
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
