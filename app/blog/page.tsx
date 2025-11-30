// Strona Blog - wyświetlanie gotowych artykułów z wyszukiwarką
// Server Component - ładuje artykuły z filesystem, przekazuje do Client Component

import { Metadata } from 'next';
import { getAllArticles } from '@/lib/articlesLoader';
import BlogClient from './BlogClient';

// Metadane SEO dla strony bloga
export const metadata: Metadata = {
  title: 'Blog - Pomocnik Prezentowy AI | Porady i Inspiracje na Prezenty',
  description: 'Odkryj najlepsze pomysły na prezenty, porady zakupowe i inspiracje dla każdej okazji. Artykuły ekspertów o prezentach na urodziny, święta i inne wyjątkowe chwile.',
  keywords: ['blog prezentowy', 'pomysły na prezenty', 'porady zakupowe', 'inspiracje prezentowe'],
};

// Server Component - pobiera artykuły z filesystem
export default function BlogPage() {
  // Pobierz wszystkie artykuły (działa tylko na serwerze)
  const allArticles = getAllArticles();

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

      {/* Główna zawartość - przekazana do Client Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogClient allArticles={allArticles} />
      </section>
    </div>
  );
}
