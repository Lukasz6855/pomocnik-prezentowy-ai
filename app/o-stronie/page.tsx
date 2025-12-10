// Strona "O stronie" - informacje o aplikacji i ostrzeżenia
import Section from '@/components/Section';
import type { Metadata } from 'next';
import { faqSchema, breadcrumbSchema } from '@/lib/schemaOrg';

// Metadata SEO
export const metadata: Metadata = {
  title: 'O Serwisie - Jak Działa Prezenty AI',
  description: 'Dowiedz się, jak działa Prezenty AI - inteligentny asystent wyboru prezentów. Poznaj technologię, politykę prywatności i ważne informacje o serwisie.',
};

// FAQ dla Schema.org
const faqItems = [
  {
    question: 'Jak działa Prezenty AI?',
    answer: 'Prezenty AI wykorzystuje sztuczną inteligencję do generowania spersonalizowanych propozycji prezentów. Podajesz okazję, płeć, wiek i budżet, a AI analizuje dane i proponuje produkty z Ceneo.',
  },
  {
    question: 'Czy korzystanie z serwisu jest bezpłatne?',
    answer: 'Tak, korzystanie z Prezenty AI jest całkowicie darmowe. Nie pobieramy żadnych opłat za generowanie rekomendacji prezentów.',
  },
  {
    question: 'Skąd pochodzą produkty w rekomendacjach?',
    answer: 'Wszystkie produkty pochodzą z serwisu Ceneo - największej polskiej porównywarki cen. Dzięki temu masz dostęp do szerokiego wyboru i aktualnych cen.',
  },
  {
    question: 'Czy moje dane są bezpieczne?',
    answer: 'Tak, przestrzegamy polityki prywatności zgodnej z RODO. Nie przechowujemy żadnych danych osobowych. Jedynie podstawowe informacje są wysyłane do AI w celu wygenerowania rekomendacji.',
  },
];

// Breadcrumbs dla Schema.org
const breadcrumbs = [
  { name: 'Strona Główna', url: 'https://prezentyai.pl' },
  { name: 'O Serwisie', url: 'https://prezentyai.pl/o-stronie' },
];

export default function StronaOStronie() {
  return (
    <>
      {/* Schema.org JSON-LD dla FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }}
      />
      {/* Schema.org JSON-LD dla Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

    <div className="min-h-screen bg-gray-50">
      <Section 
        tytul="ℹ️ O Stronie"
        opis="Pomocnik Prezentowy AI - Twój inteligentny asystent w wyborze idealnego prezentu"
      >
        {/* Jak działa aplikacja */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Jak działa nasza aplikacja?
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Pomocnik Prezentowy AI</strong> to nowoczesna aplikacja webowa wykorzystująca 
              sztuczną inteligencję do generowania spersonalizowanych propozycji prezentów z rzeczywistymi produktami.
            </p>
            <p>
              Nasza aplikacja działa w trzech krokach:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li>
                <strong>Zbieramy informacje</strong> - podajesz podstawowe dane: okazję, płeć, wiek i budżet. 
                Opcjonalnie możesz dodać szczegółowy opis swoimi słowami.
              </li>
              <li>
                <strong>AI generuje pomysły</strong> - sztuczna inteligencja analizuje Twoje dane i tworzy 
                10-12 różnorodnych pomysłów na prezenty, dopasowanych do kontekstu.
              </li>
              <li>
                <strong>Propozycje prezentów</strong> - dla każdego pomysłu AI wyszukujemy rzeczywiste produkty, sprawdzając ceny, oceny i dostępność. Otrzymujesz do 10 konkretnych propozycji 
                z linkami do porównywarki cen Ceneo, gdzie możesz dokonać bezpośredniego zakupu lub wybrać inny preferowany sklep.
              </li>
            </ol>
            <p className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
              <strong>💡 Wskazówka:</strong> Im więcej szczegółów podasz w opisie tekstowym, tym bardziej 
              dopasowane będą propozycje. Możesz opisać osobowość, hobby, to co osoba już ma, itp.
            </p>
          </div>
        </div>
        
        {/* Technologia */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🤖 Technologia
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              Aplikacja wykorzystuje zaawansowane modele sztucznej inteligencji OpenAI oraz 
              integrację z Ceneo, największą polską porównywarką cen.
            </p>
            <p>
              <strong>Jak to działa technicznie:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>OpenAI GPT</strong> - generuje kreatywne, dopasowane pomysły na prezenty na podstawie Twoich danych</li>
              <li><strong>Ceneo</strong> - wyszukuje rzeczywiste produkty, sprawdza ceny i dostępność</li>
              <li><strong>Dobór propozycji przez AI</strong> - system wybiera najlepiej pasujące produkty według popularności i ocen</li>
              <li><strong>Przekierowanie do sklepu</strong> - generujemy linki do Ceneo</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              Wszystkie propozycje pochodzą z prawdziwych ofert dostępnych w Ceneo - nie wymyślamy produktów ani cen.
            </p>
          </div>
        </div>
        
        {/* WAŻNE OSTRZEŻENIE */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            Ważne informacje i ostrzeżenia
          </h3>
          <div className="space-y-3 text-yellow-800 text-sm">
            <p>
              <strong>To są propozycje AI + rzeczywiste produkty z Ceneo:</strong> Pomysły na prezenty 
              generuje AI, a produkty pochodzą z prawdziwych ofert w Ceneo. Jednak AI może zaproponować 
              coś nieodpowiedniego - zawsze kieruj się zdrowym rozsądkiem.
            </p>
            <p>
              <strong>Weryfikuj przed zakupem:</strong> Kliknięcie w link przenosi Cię do Ceneo, 
              gdzie możesz:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Sprawdzić aktualne ceny w różnych sklepach</li>
              <li>Przeczytać opinie innych użytkowników</li>
              <li>Porównać parametry i warianty produktu</li>
              <li>Wybrać najlepszą ofertę dla siebie</li>
            </ul>
            <p>
              <strong>Prywatność:</strong> Nie przechowujemy Twoich danych osobowych na serwerze. 
              Ulubione prezenty zapisują się lokalnie w Twojej przeglądarce.
            </p>
          </div>
        </div>
        
        {/* Funkcje aplikacji */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✨ Funkcje aplikacji
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h4 className="font-semibold">Wyszukiwarka prezentów</h4>
                <p className="text-sm text-gray-600">
                  Formularz szczegółowy lub opis swobodny
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">❤️</span>
              <div>
                <h4 className="font-semibold">Ulubione</h4>
                <p className="text-sm text-gray-600">
                  Zapisuj i zarządzaj ulubionymi prezentami
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📝</span>
              <div>
                <h4 className="font-semibold">Blog prezentowy</h4>
                <p className="text-sm text-gray-600">
                  Porady i inspiracje na prezenty
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-semibold">Porównanie cen</h4>
                <p className="text-sm text-gray-600">
                  Zobacz ceny w różnych sklepach
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold">Linki do sklepów</h4>
                <p className="text-sm text-gray-600">
                  Bezpośrednie linki zakupowe
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
    </>
  );
}
