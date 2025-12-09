// Schema.org JSON-LD struktury dla różnych stron

// Website Schema - dla głównej strony
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Prezenty AI',
  url: 'https://prezentyai.pl',
  description: 'Inteligentny asystent wyboru prezentów wykorzystujący AI. Spersonalizowane rekomendacje produktów z Ceneo.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://prezentyai.pl/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Organization Schema - informacje o organizacji
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prezenty AI',
  url: 'https://prezentyai.pl',
  logo: 'https://prezentyai.pl/logo.png',
  description: 'Inteligentny asystent wyboru prezentów wykorzystujący sztuczną inteligencję i bazę produktów Ceneo.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'sachmerda@gmail.com',
    contactType: 'Customer Service',
    areaServed: 'PL',
    availableLanguage: 'Polish',
  },
  sameAs: [
    // Dodaj linki do social media gdy będą dostępne
  ],
};

// Breadcrumb Schema - nawigacja okruszkowa
export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// FAQ Schema - często zadawane pytania
export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Product Schema - dla rekomendacji produktów
export const productSchema = (product: {
  name: string;
  description: string;
  image?: string;
  price?: string;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image || '',
  offers: product.price
    ? {
        '@type': 'Offer',
        price: product.price.replace(/[^\d.,]/g, '').replace(',', '.'),
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
        url: product.url || '',
      }
    : undefined,
});

// Article Schema - dla artykułów blogowych (już istnieje w [slug]/page.tsx, ale wersja uogólniona)
export const articleSchema = (article: {
  title: string;
  excerpt: string;
  thumbnail?: string;
  date: string;
  author?: string;
  keywords?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.thumbnail || '',
  datePublished: article.date,
  dateModified: article.date,
  author: {
    '@type': 'Person',
    name: article.author || 'Prezenty AI',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Prezenty AI',
    logo: {
      '@type': 'ImageObject',
      url: 'https://prezentyai.pl/logo.png',
    },
  },
  keywords: article.keywords?.join(', ') || '',
});
