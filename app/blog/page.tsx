// Strona Blog - wyświetlanie gotowych artykułów
// Ta strona TYLKO wyświetla artykuły wygenerowane wcześniej i zapisane jako JSON w /articles
// NIE zawiera żadnego generatora AI ani formularzy - to czysto prezentacyjna strona dla użytkowników

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesPaginated } from '@/lib/articlesLoader';
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

// Metadane SEO dla strony bloga
export const metadata: Metadata = {
  title: 'Blog - Pomocnik Prezentowy AI | Porady i Inspiracje na Prezenty',
  description: 'Odkryj najlepsze pomysły na prezenty, porady zakupowe i inspiracje dla każdej okazji. Artykuły ekspertów o prezentach na urodziny, święta i inne wyjątkowe chwile.',
  keywords: ['blog prezentowy', 'pomysły na prezenty', 'porady zakupowe', 'inspiracje prezentowe'],
};

// Komponent strony bloga - renderowany po stronie serwera
export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Pobierz numer strony z URL (domyślnie 1)
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // Pobierz artykuły z paginacją (12 artykułów na stronę)
  const { articles, totalPages, totalArticles, hasNextPage, hasPrevPage } = 
    getArticlesPaginated(currentPage, 12);

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
          {totalArticles > 0 && (
            <p className="mt-6 text-sm opacity-75">
              📝 {totalArticles} {totalArticles === 1 ? 'artykuł' : totalArticles < 5 ? 'artykuły' : 'artykułów'}
            </p>
          )}
        </div>
      </section>

      {/* Główna zawartość - lista artykułów */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          // Komunikat gdy brak artykułów
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
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Komponent karty artykułu - pojedyncza karta na liście
function ArticleCard({ article }: { article: any }) {
  // Formatowanie daty do polskiego formatu (np. "29 listopada 2025")
  const formattedDate = new Date(article.date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

// Komponent paginacji - nawigacja między stronami
function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {/* Przycisk poprzednia strona */}
      {hasPrevPage ? (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
        >
          <ChevronLeft className="w-5 h-5" />
          Poprzednia
        </Link>
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
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
        >
          Następna
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
          Następna
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
