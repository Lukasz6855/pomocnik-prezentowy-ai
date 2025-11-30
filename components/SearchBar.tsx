// Komponent SearchBar - pole wyszukiwania artykułów blogowych
// Wyszukiwanie działa po stronie klienta, "na żywo" podczas wpisywania (on input)
// Przeszukuje: tytuły, opisy (excerpt) i tagi/keywords

'use client';

import { Search, X } from 'lucide-react';

// Interface dla props komponentu
interface SearchBarProps {
  searchQuery: string;                     // Aktualna wartość wyszukiwania (kontrolowany input)
  onSearchChange: (query: string) => void; // Callback wywoływany przy zmianie wartości
  resultsCount?: number;                   // Liczba znalezionych wyników (opcjonalne, do wyświetlenia)
}

export default function SearchBar({ 
  searchQuery, 
  onSearchChange,
  resultsCount 
}: SearchBarProps) {
  
  // Funkcja czyszcząca pole wyszukiwania
  const handleClear = () => {
    onSearchChange(''); // Wyczyść query
  };

  return (
    <div className="mb-8">
      {/* Pole wyszukiwania z ikoną */}
      <div className="relative max-w-2xl mx-auto">
        {/* Ikona lupy po lewej stronie */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input wyszukiwania */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)} // Wywołaj callback przy każdej zmianie
          placeholder="Szukaj artykułów... (tytuł, opis, tagi)"
          className="
            w-full 
            pl-12 pr-12 py-4 
            text-gray-900 
            bg-white 
            border-2 border-gray-200 
            rounded-xl 
            shadow-sm
            focus:outline-none 
            focus:ring-2 
            focus:ring-purple-500 
            focus:border-transparent
            transition-all
            placeholder:text-gray-400
          "
        />

        {/* Przycisk czyszczący (X) - widoczny tylko gdy coś wpisano */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="
              absolute 
              inset-y-0 
              right-0 
              pr-4 
              flex 
              items-center
              text-gray-400 
              hover:text-gray-600
              transition-colors
            "
            aria-label="Wyczyść wyszukiwanie"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Informacja o liczbie wyników - jeśli przekazano resultsCount */}
      {searchQuery && typeof resultsCount !== 'undefined' && (
        <div className="text-center mt-3 text-sm text-gray-600">
          {resultsCount === 0 ? (
            // Brak wyników
            <span className="text-gray-500">
              Nie znaleziono artykułów dla &quot;{searchQuery}&quot;
            </span>
          ) : resultsCount === 1 ? (
            // 1 wynik
            <span>
              Znaleziono <strong className="text-purple-600">1 artykuł</strong>
            </span>
          ) : resultsCount < 5 ? (
            // 2-4 wyniki
            <span>
              Znaleziono <strong className="text-purple-600">{resultsCount} artykuły</strong>
            </span>
          ) : (
            // 5+ wyników
            <span>
              Znaleziono <strong className="text-purple-600">{resultsCount} artykułów</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
