// Client Component - wyszukiwarka i logika bloga
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Article } from '@/lib/types';

export default function BlogClient({ allArticles }: { allArticles: Article[] }) {
  // Stan wyszukiwania i paginacji
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;
  
  // 🔍 Logika wyszukiwania - filtruje artykuły na podstawie query
  const filteredArticles = useMemo(() => {
    // Jeśli pole puste → pokaż wszystkie artykuły
    if (!searchQuery.trim()) return allArticles;
    
    // Case-insensitive wyszukiwanie
    const query = searchQuery.toLowerCase();
    
    // Filtruj używając includes() - znajduje częściowe dopasowania
    return allArticles.filter(article => 
      // Przeszukuj tytuły
      article.title.toLowerCase().includes(query) ||
      // Przeszukuj opisy (excerpt)
      article.excerpt.toLowerCase().includes(query) ||
      // Przeszukuj tagi/keywords
      article.keywords?.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [allArticles, searchQuery]);
  
  // Paginacja po przefiltrowanych artykułach
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const articles = filteredArticles.slice(startIndex, endIndex);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  // Handler wyszukiwania - resetuje do strony 1 przy nowym query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset paginacji
  };

  return (
    <>
      {/* 🔍 Wyszukiwarka - widoczna gdy są artykuły */}
      {allArticles.length > 0 && (
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          resultsCount={totalArticles}
        />
      )}
      
      {articles.length === 0 ? (
        // Komunikat gdy brak artykułów lub brak wyników wyszukiwania
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {searchQuery ? '🔍' : '📝'}
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {searchQuery 
              ? 'Brak wyników'
              : 'Brak artykułów'
            }
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Nie znaleziono artykułów. Spróbuj użyć innych słów kluczowych.'
              : 'Artykuły pojawią się wkrótce. Dodaj pliki JSON do folderu /articles'
            }
          </p>
          {searchQuery ? (
            <button
              onClick={() => handleSearchChange('')}
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Wyczyść wyszukiwanie
            </button>
          ) : (
            <Link 
              href="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Wróć na stronę główną
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Grid z kartami artykułów - 3 kolumny desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {/* Paginacja - jeśli jest więcej niż 1 strona */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </>
  );
}

// Komponent karty artykułu - pojedyncza karta na liście
function ArticleCard({ article }: { article: Article }) {
  // Formatuj datę do czytelnego formatu
  const formattedDate = new Date(article.date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="
        group
        bg-white 
        rounded-xl 
        shadow-md 
        overflow-hidden 
        hover:shadow-xl 
        transition-shadow 
        duration-300
        flex 
        flex-col
      "
    >
      {/* Obrazek artykułu */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="text-6xl opacity-20">📝</div>
          </div>
        )}
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
          {article.title}
        </h2>

        {/* Excerpt - krótki opis */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {article.excerpt}
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
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

// Komponent paginacji - nawigacja między stronami (client-side)
function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {/* Przycisk poprzednia strona */}
      {hasPrevPage ? (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
        >
          <ChevronLeft className="w-5 h-5" />
          Poprzednia
        </button>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
          Poprzednia
        </div>
      )}

      {/* Informacja o aktualnej stronie */}
      <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold">
        Strona {currentPage} z {totalPages}
      </div>

      {/* Przycisk następna strona */}
      {hasNextPage ? (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
        >
          Następna
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
          Następna
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
