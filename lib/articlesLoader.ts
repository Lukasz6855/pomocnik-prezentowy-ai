// Loader artykułów blogowych z lokalnych plików JSON
// Artykuły są generowane w osobnym narzędziu i zapisywane jako JSON w folderze /articles

import fs from 'fs';
import path from 'path';
import { Article } from './types';

// Ścieżka do folderu z artykułami
const articlesDirectory = path.join(process.cwd(), 'articles');

/**
 * Pobiera wszystkie artykuły z folderu /articles
 * Każdy plik JSON to jeden artykuł
 * Zwraca posortowane po dacie (najnowsze na górze)
 */
export function getAllArticles(): Article[] {
  try {
    // Sprawdź czy folder istnieje
    if (!fs.existsSync(articlesDirectory)) {
      console.warn('⚠️ Folder /articles nie istnieje. Tworzę pusty...');
      fs.mkdirSync(articlesDirectory, { recursive: true });
      return [];
    }

    // Pobierz wszystkie pliki JSON z folderu
    const fileNames = fs.readdirSync(articlesDirectory);
    const jsonFiles = fileNames.filter(name => name.endsWith('.json'));

    // Wczytaj każdy plik i sparsuj JSON
    const articles: Article[] = jsonFiles.map(fileName => {
      const filePath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const article = JSON.parse(fileContents) as Article;
      
      return article;
    });

    // Sortuj po dacie (najnowsze na górze)
    articles.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return articles;
  } catch (error) {
    console.error('❌ Błąd wczytywania artykułów:', error);
    return [];
  }
}

/**
 * Pobiera pojedynczy artykuł po slug
 * @param slug - Unikalny identyfikator artykułu (np. "najlepsze-prezenty-na-swieta")
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    // Szukaj pliku JSON z odpowiednim slug
    const allArticles = getAllArticles();
    const article = allArticles.find(a => a.slug === slug);
    
    if (!article) {
      console.warn(`⚠️ Artykuł o slug="${slug}" nie istnieje`);
      return null;
    }

    return article;
  } catch (error) {
    console.error(`❌ Błąd wczytywania artykułu ${slug}:`, error);
    return null;
  }
}

/**
 * Pobiera artykuły z paginacją
 * @param page - Numer strony (1, 2, 3...)
 * @param perPage - Liczba artykułów na stronę (domyślnie 12)
 */
export function getArticlesPaginated(page: number = 1, perPage: number = 12) {
  const allArticles = getAllArticles();
  const totalArticles = allArticles.length;
  const totalPages = Math.ceil(totalArticles / perPage);
  
  // Walidacja strony
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  
  // Wytnij odpowiednią część artykułów
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const articles = allArticles.slice(startIndex, endIndex);

  return {
    articles,           // Artykuły na bieżącej stronie
    currentPage,        // Bieżąca strona
    totalPages,         // Całkowita liczba stron
    totalArticles,      // Całkowita liczba artykułów
    hasNextPage: currentPage < totalPages,   // Czy jest następna strona
    hasPrevPage: currentPage > 1,            // Czy jest poprzednia strona
  };
}
