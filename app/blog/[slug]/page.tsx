// Strona pojedynczego artykułu - dynamiczny routing /blog/[slug]
// Wyświetla pełną treść artykułu z folderu /articles w formacie Markdown
// Zawiera: parser Markdown, breadcrumbs, kolorowe tagi, metadane SEO, schema.org

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug, getAllArticles } from '@/lib/articlesLoader';
import { getRelatedArticles } from '@/lib/articleUtils';
import { Calendar, Tag, Home, ChevronRight, User } from 'lucide-react';

// Generowanie metadanych SEO dla każdego artykułu dynamicznie
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Pobierz artykuł po slug
  const article = getArticleBySlug(params.slug);

  // Jeśli artykuł nie istnieje - domyślne metadane
  if (!article) {
    return {
      title: 'Artykuł nie znaleziony - Pomocnik Prezentowy AI',
      description: 'Przepraszamy, ale artykuł o podanym adresie nie został odnaleziony.',
    };
  }

  // Metadane SEO dla konkretnego artykułu
  return {
    title: `${article.title} - Blog Pomocnik Prezentowy AI`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords?.join(', '),
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.excerpt,
      type: 'article',
      publishedTime: article.date,
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
  };
}

// Generowanie statycznych ścieżek dla wszystkich artykułów (opcjonalne - dla lepszego SEO)
export async function generateStaticParams() {
  const articles = getAllArticles();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Komponent strony artykułu
export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  // Pobierz artykuł po slug
  const article = getArticleBySlug(params.slug);

  // Jeśli artykuł nie istnieje - przekieruj na stronę 404
  if (!article) {
    notFound();
  }

  // Pobierz wszystkie artykuły dla powiązanych
  const allArticles = getAllArticles();
  
  // Znajdź powiązane artykuły (max 3)
  const relatedArticles = getRelatedArticles(article, allArticles, 3);

  // Formatowanie daty do polskiego formatu
  const formattedDate = new Date(article.date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Schema.org JSON-LD dla lepszego SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail || '',
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author || 'Pomocnik Prezentowy AI',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pomocnik Prezentowy AI',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    keywords: article.keywords?.join(', '),
  };

  return (
    <>
      {/* Schema.org JSON-LD dla SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        {/* Breadcrumbs - nawigacja */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              {/* Link do strony głównej */}
              <Link href="/" className="flex items-center hover:text-purple-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Link do bloga */}
              <Link href="/blog" className="hover:text-purple-600 transition-colors">
                Blog
              </Link>
              
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Aktualny artykuł */}
              <span className="text-purple-600 font-medium truncate max-w-xs">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Główna zawartość artykułu */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header artykułu */}
          <header className="mb-8">
            {/* Tytuł artykułu */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">
              {article.title}
            </h1>

            {/* Metainformacje: data, autor */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              {/* Data publikacji */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={article.date}>{formattedDate}</time>
              </div>

              {/* Autor (jeśli istnieje) */}
              {article.author && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{article.author}</span>
                  </div>
                </>
              )}
            </div>

            {/* Miniaturka artykułu (jeśli istnieje) */}
            {article.thumbnail && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg mb-6">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Excerpt - krótki wstęp */}
            <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
              {article.excerpt}
            </p>
          </header>

          {/* Treść artykułu w Markdown - parser react-markdown */}
          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Stylizacja nagłówków
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 font-poppins" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3 font-poppins" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2" {...props} />
                ),
                
                // Stylizacja paragrafów
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                ),
                
                // Stylizacja list
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                
                // Stylizacja linków
                a: ({ node, ...props }) => (
                  <a 
                    className="text-purple-600 hover:text-purple-700 underline font-medium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    {...props} 
                  />
                ),
                
                // Stylizacja cytatów
                blockquote: ({ node, ...props }) => (
                  <blockquote 
                    className="border-l-4 border-purple-500 pl-4 italic text-gray-700 bg-purple-50 p-4 rounded-r-lg my-4" 
                    {...props} 
                  />
                ),
                
                // Stylizacja kodu inline
                code: ({ node, ...props }) => (
                  <code className="bg-gray-100 text-purple-600 px-2 py-1 rounded text-sm font-mono" {...props} />
                ),
                
                // Stylizacja bloków kodu
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                ),
              }}
            >
              {article.contentMarkdown}
            </ReactMarkdown>
          </div>

          {/* Tagi / Keywords - kolorowe badge'y */}
          {article.keywords && article.keywords.length > 0 && (
            <footer className="border-t border-gray-200 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tagi
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </footer>
          )}

          {/* Sekcja: Powiązane artykuły */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">
                📖 Powiązane artykuły
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    {/* Miniaturka */}
                    {related.thumbnail && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={related.thumbnail}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Treść karty */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {related.excerpt}
                      </p>
                      
                      {/* Data */}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(related.date).toLocaleDateString('pl-PL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Przycisk powrotu do bloga */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              ← Wróć do bloga
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
