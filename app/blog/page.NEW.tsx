// Strona Blog - wyświetlanie gotowych artykułów z wyszukiwarką
// Wyszukiwarka działa po stronie klienta - filtruje artykuły "na żywo"
// Przeszukuje: tytuły, opisy (excerpt) i tagi/keywords

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articlesLoader';
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Article } from '@/lib/types';

// Funkcja filtrująca artykuły na podstawie wyszukiwania
// Case-insensitive, częściowe dopasowanie w title, excerpt i keywords
function filterArticles(articles: Article[], searchQuery: string): Article[] {
  // Jeśli pole wyszukiwania jest puste - zwróć wszystkie artykuły
  if (!searchQuery.trim()) {
    return articles;
  }

  // Konwertuj query na małe litery dla case-insensitive search
  const query = searchQuery.toLowerCase();

  // Filtruj artykuły - sprawdź czy query występuje w title, excerpt lub keywords
  return articles.filter((article) => {
    // Sprawdź tytuł
    const titleMatch = article.title.toLowerCase().includes(query);
    
    // Sprawdź excerpt (krótki opis)
    const excerptMatch = article.excerpt.toLowerCase().includes(query);
    
    // Sprawdź keywords (tagi) - czy którykolwiek tag zawiera query
    const keywordsMatch = article.keywords?.some(keyword => 
      keyword.toLowerCase().includes(query)
    ) || false;

    // Zwróć true jeśli znaleziono dopasowanie w którymkolwiek polu
    return titleMatch || excerptMatch || keywordsMatch;
  });
}

// Komponent strony bloga
export default function BlogPage() {
  // Stan wyszukiwania
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stan paginacji
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12; // Liczba artykułów na stronę

  // Pobierz wszystkie artykuły (wykonywane tylko raz przy montowaniu)
  const allArticles = useMemo(() => getAllArticles(), []);

  // Przefiltruj artykuły na podstawie wyszukiwania (useMemo dla optymalizacji)
  const filteredArticles = useMemo(() => 
    filterArticles(allArticles, searchQuery),
    [allArticles, searchQuery]
  );

  // Resetuj stronę do 1 gdy zmienia się query wyszukiwania
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Oblicz paginację dla przefiltrowanych artykułów
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Sprawdź czy są następna/poprzednia strona
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header sekcji bloga */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tytuł główny */}
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
            📚 Blog Prezentowy
          </h1>
          
          {/* Opis */}
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Porady ekspertów, inspiracje i najlepsze pomysły na prezenty dla każdej okazji
          </p>
          
          {/* Statystyka artykułów */}
          {allArticles.length > 0 && (
            <p className="mt-6 text-sm opacity-75">
              📝 {allArticles.length} {allArticles.length === 1 ? 'artykuł' : allArticles.length < 5 ? 'artykuły' : 'artykułów'}
            </p>
          )}
        </div>
      </section>

      {/* Główna zawartość - wyszukiwarka i lista artykułów */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {allArticles.length === 0 ? (
          // Komunikat gdy brak artykułów w folderze /articles
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Brak artykułów
            </h2>
            <p className="text-gray-500 mb-6">
              Artykuły pojawią się wkrótce. Dodaj pliki JSON do folderu <code className="bg-gray-100 px-2 py-1 rounded">/articles</code>
            </p>
            <Link 
              href="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Wróć na stronę główną
            </Link>
          </div>
        ) : (
          <>
            {/* Wyszukiwarka artykułów */}
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultsCount={filteredArticles.length}
            />

            {/* Lista artykułów lub komunikat "Brak wyników" */}
            {paginatedArticles.length === 0 ? (
              // Komunikat gdy filtrowanie nie zwróciło wyników
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Brak wyników
                </h2>
                <p className="text-gray-500 mb-6">
                  Nie znaleziono artykułów dla &quot;{searchQuery}&quot;.<br />
                  Spróbuj użyć innych słów kluczowych.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Wyczyść wyszukiwanie
                </button>
              </div>
            ) : (
              <>
                {/* Grid z kartami artykułów - 3 kolumny desktop, 2 tablet, 1 mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} searchQuery={searchQuery} />
                  ))}
                </div>

                {/* Paginacja - jeśli jest więcej niż 1 strona */}
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                  />
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Komponent karty artykułu - pojedyncza karta na liście
function ArticleCard({ article, searchQuery }: { article: Article; searchQuery?: string }) {
  // Formatowanie daty do polskiego formatu (np. "29 listopada 2025")
  const formattedDate = new Date(article.date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Funkcja podświetlająca wyszukiwane frazy w tekście (opcjonalne - dla lepszego UX)
  const highlightText = (text: string) => {
    if (!searchQuery || !searchQuery.trim()) return text;
    
    // Prosta implementacja - w produkcji można użyć biblioteki jak react-highlight-words
    return text;
  };

  return (
    <Link 
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Miniaturka artykułu */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
        {article.thumbnail ? (
          // Jeśli artykuł ma miniaturkę - wyświetl obrazek
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          // Fallback - gradient z ikoną jeśli brak miniaturki
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">📝</div>
          </div>
        )}
        
        {/* Overlay gradient na hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Zawartość karty */}
      <div className="p-6">
        {/* Data publikacji */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formattedDate}</span>
        </div>

        {/* Tytuł artykułu */}
        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
          {highlightText(article.title)}
        </h2>

        {/* Excerpt - krótki opis */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {highlightText(article.excerpt)}
        </p>

        {/* Tags - pierwsze 3 słowa kluczowe */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.keywords.slice(0, 3).map((keyword: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
              >
                <Tag className="w-3 h-3 mr-1" />
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Link "Czytaj więcej" */}
        <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:text-purple-700">
          Czytaj więcej
          <ChevronLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

// Komponent paginacji - nawigacja między stronami
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {/* Przycisk poprzednia strona */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-shadow
          ${hasPrevPage 
            ? 'bg-white text-gray-700 hover:shadow-md hover:text-purple-600 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
        Poprzednia
      </button>

      {/* Informacja o aktualnej stronie */}
      <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold">
        Strona {currentPage} z {totalPages}
      </div>

      {/* Przycisk następna strona */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-shadow
          ${hasNextPage 
            ? 'bg-white text-gray-700 hover:shadow-md hover:text-purple-600 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Następna
        <ChevronLeft className="w-5 h-5 rotate-180" />
      </button>
    </div>
  );
}
