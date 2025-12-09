// Funkcje pomocnicze do analizy i dopasowywania artykułów

import { Article } from './types';

/**
 * Oblicza podobieństwo między dwoma artykułami na podstawie tagów i słów kluczowych
 * @param article1 - Pierwszy artykuł
 * @param article2 - Drugi artykuł
 * @returns Wynik podobieństwa (0-1, gdzie 1 to identyczne)
 */
export function calculateArticleSimilarity(article1: Article, article2: Article): number {
  // Nie porównuj artykułu z samym sobą
  if (article1.slug === article2.slug) {
    return 0;
  }

  const keywords1 = new Set(article1.keywords?.map(k => k.toLowerCase()) || []);
  const keywords2 = new Set(article2.keywords?.map(k => k.toLowerCase()) || []);

  // Jeśli brak tagów - brak podobieństwa
  if (keywords1.size === 0 || keywords2.size === 0) {
    return 0;
  }

  // Oblicz przecięcie zbiorów (wspólne tagi)
  const intersection = new Set([...keywords1].filter(k => keywords2.has(k)));
  
  // Oblicz unię zbiorów (wszystkie unikalne tagi)
  const union = new Set([...keywords1, ...keywords2]);

  // Współczynnik Jaccarda: |A ∩ B| / |A ∪ B|
  const jaccardSimilarity = intersection.size / union.size;

  // Bonus za podobieństwo w tytule (proste sprawdzenie wspólnych słów)
  const title1Words = new Set(article1.title.toLowerCase().split(/\s+/));
  const title2Words = new Set(article2.title.toLowerCase().split(/\s+/));
  const titleIntersection = new Set([...title1Words].filter(w => title2Words.has(w) && w.length > 3));
  const titleBonus = titleIntersection.size > 0 ? 0.1 : 0;

  return Math.min(1, jaccardSimilarity + titleBonus);
}

/**
 * Znajduje powiązane artykuły dla danego artykułu
 * @param currentArticle - Artykuł, dla którego szukamy powiązanych
 * @param allArticles - Wszystkie dostępne artykuły
 * @param maxResults - Maksymalna liczba wyników (domyślnie 3)
 * @returns Tablica powiązanych artykułów posortowana według podobieństwa
 */
export function getRelatedArticles(
  currentArticle: Article,
  allArticles: Article[],
  maxResults: number = 3
): Article[] {
  // Oblicz podobieństwo dla wszystkich artykułów
  const articlesWithSimilarity = allArticles
    .filter(article => article.slug !== currentArticle.slug) // Wykluczamy obecny artykuł
    .map(article => ({
      article,
      similarity: calculateArticleSimilarity(currentArticle, article),
    }))
    .filter(item => item.similarity > 0) // Wykluczamy artykuły bez podobieństwa
    .sort((a, b) => b.similarity - a.similarity); // Sortujemy malejąco

  // Jeśli znaleziono artykuły podobne
  if (articlesWithSimilarity.length > 0) {
    return articlesWithSimilarity
      .slice(0, maxResults)
      .map(item => item.article);
  }

  // Fallback: jeśli brak podobnych artykułów, zwróć losowe najnowsze
  return allArticles
    .filter(article => article.slug !== currentArticle.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxResults);
}

/**
 * Ekstrahuje główne kategorie/tematy z tagów artykułu
 * @param article - Artykuł do analizy
 * @returns Tablica kategorii
 */
export function extractCategories(article: Article): string[] {
  const categories: Set<string> = new Set();

  article.keywords?.forEach(keyword => {
    const lower = keyword.toLowerCase();
    
    // Kategoria: Święta
    if (lower.includes('święt') || lower.includes('choink')) {
      categories.add('Święta');
    }
    
    // Kategoria: Urodziny
    if (lower.includes('urodzin')) {
      categories.add('Urodziny');
    }
    
    // Kategoria: Budżet
    if (lower.includes('zł') || lower.includes('budżet') || lower.includes('tani')) {
      categories.add('Budżet');
    }
    
    // Kategoria: Rodzina
    if (lower.includes('rodzic') || lower.includes('mam') || lower.includes('tat') || 
        lower.includes('żon') || lower.includes('mąż')) {
      categories.add('Rodzina');
    }
    
    // Kategoria: Romantyczne
    if (lower.includes('walentyn') || lower.includes('rocznic') || lower.includes('romantycz')) {
      categories.add('Romantyczne');
    }
    
    // Kategoria: Dzieci
    if (lower.includes('dziec')) {
      categories.add('Dzieci');
    }
  });

  return Array.from(categories);
}

/**
 * Generuje sugerowany tekst dla sekcji "Powiązane artykuły"
 * @param categories - Kategorie obecnego artykułu
 * @returns Tekst nagłówka
 */
export function generateRelatedArticlesHeading(categories: string[]): string {
  if (categories.length === 0) {
    return 'Przeczytaj również';
  }

  return `Więcej artykułów o: ${categories.join(', ')}`;
}
