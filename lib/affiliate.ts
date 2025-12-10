// Helper do generowania linków afiliacyjnych (mock dla MVP)

// Lista dostępnych platform afiliacyjnych
const PLATFORMY_AFILIACYJNE = [
  'Amazon.pl', 
  'Allegro', 
  'Ceneo', 
  'Empik',
  'Smyk',
  'Pepco',
  'Douglas',
  'Reserved'
];

/**
 * Wyciąga krótką nazwę produktu (bez opisu po myślniku)
 * Np. "Apple AirPods Pro (2. generacji) - Słuchawki bezprzewodowe" -> "Apple AirPods Pro (2. generacji)"
 * @param pelnyTytul - pełny tytuł produktu
 * @returns skrócona nazwa produktu
 */
function wyciagnijNazweProductu(pelnyTytul: string): string {
  // Jeśli tytuł zawiera " - ", bierzemy tylko część przed myślnikiem
  const czesci = pelnyTytul.split(' - ');
  return czesci[0].trim();
}

/**
 * Generuje mockowe linki afiliacyjne dla danego produktu
 * W wersji MVP linki prowadzą do wyszukiwania produktu
 * W przyszłości można je zastąpić prawdziwymi linkami z API sklepów
 * @param nazwaProduktu - pełna nazwa produktu z marką i modelem
 * @returns tablica linków afiliacyjnych (2-3 losowe platformy)
 */
export function generujLinkiAfiliacyjne(nazwaProduktu: string): string[] {
  // Wyciągnij krótką nazwę produktu (bez opisu)
  const krotkaNazwa = wyciagnijNazweProductu(nazwaProduktu);
  
  // Kodowanie nazwy produktu dla URL
  const zakodowanaNazwa = encodeURIComponent(krotkaNazwa);
  
  // Losowanie 2-3 platform
  const liczbaLinkow = Math.floor(Math.random() * 2) + 2; // 2 lub 3
  const wylosowanePlatformy = [...PLATFORMY_AFILIACYJNE]
    .sort(() => Math.random() - 0.5)
    .slice(0, liczbaLinkow);
  
  // Generowanie bardziej realistycznych linków (mockowe dla MVP)
  // UWAGA: W przyszłości te linki powinny prowadzić do konkretnych produktów
  // poprzez integrację z API Allegro/Ceneo lub web scraping
  return wylosowanePlatformy.map(platforma => {
    // Generowanie pseudo-realistycznego ID produktu (mock)
    const mockProductId = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    switch (platforma) {
      case 'Amazon.pl':
        // Format: amazon.pl/s?k=[query]&tag=affiliate
        return `https://amazon.pl/s?k=${zakodowanaNazwa}&tag=pomocnikprezentowy-21`;
      case 'Allegro':
        // Format: allegro.pl/listing?string=[query]
        return `https://allegro.pl/listing?string=${zakodowanaNazwa}`;
      case 'Ceneo':
        // Format: ceneo.pl/;szukaj-[query]#pid=[PARTNER_ID]
        return `https://www.ceneo.pl/;szukaj-${zakodowanaNazwa}#pid=30364`;
      case 'Empik':
        // Format: empik.com/szukaj/produkt?q=[query]
        return `https://empik.com/szukaj/produkt?q=${zakodowanaNazwa}`;
      case 'Smyk':
        // Format: smyk.com/search?q=[query]
        return `https://smyk.com/search?q=${zakodowanaNazwa}`;
      case 'Pepco':
        // Format: pepco.pl/szukaj?q=[query]
        return `https://pepco.pl/szukaj?q=${zakodowanaNazwa}`;
      case 'Douglas':
        // Format: douglas.pl/pl/search?query=[query]
        return `https://douglas.pl/pl/search?query=${zakodowanaNazwa}`;
      case 'Reserved':
        // Format: reserved.com/pl/pl/search?q=[query]
        return `https://reserved.com/pl/pl/search?q=${zakodowanaNazwa}`;
      default:
        return `https://google.com/search?q=${zakodowanaNazwa}+cena`;
    }
  });
}

/**
 * Generuje mockowe dane porównania cen dla produktu
 * @param nazwaProduktu - nazwa produktu
 * @returns tablica obiektów z informacjami o cenach w różnych sklepach
 */
export function generujPorownanieCen(nazwaProduktu: string) {
  // Wyciągnij krótką nazwę produktu (bez opisu)
  const krotkaNazwa = wyciagnijNazweProductu(nazwaProduktu);
  const zakodowanaNazwa = encodeURIComponent(krotkaNazwa);
  
  // Losowa cena bazowa (50-500 PLN)
  const cenaBazowa = Math.floor(Math.random() * 450) + 50;
  
  // Generowanie cen dla 2-3 sklepów z małymi różnicami
  const sklepy = [
    {
      sklep: 'Allegro',
      cena: `${cenaBazowa + Math.floor(Math.random() * 30 - 15)} PLN`,
      linkAfiliacyjny: `https://allegro.pl/listing?string=${zakodowanaNazwa}`
    },
    {
      sklep: 'Ceneo',
      cena: `${cenaBazowa + Math.floor(Math.random() * 30 - 15)} PLN`,
      linkAfiliacyjny: `https://www.ceneo.pl/;szukaj-${zakodowanaNazwa}#pid=30364`
    },
    {
      sklep: 'Amazon.pl',
      cena: `${cenaBazowa + Math.floor(Math.random() * 30 - 15)} PLN`,
      linkAfiliacyjny: `https://amazon.pl/s?k=${zakodowanaNazwa}&tag=pomocnikprezentowy-21`
    }
  ];
  
  // Losowe wybranie 2-3 sklepów
  return sklepy
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2);
}
