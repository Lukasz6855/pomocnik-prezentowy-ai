// Strona "O stronie" - informacje o aplikacji i ostrzeżenia
import Section from '@/components/Section';

export default function StronaOStronie() {
  return (
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
              sztuczną inteligencję do generowania spersonalizowanych propozycji prezentów.
            </p>
            <p>
              Nasza aplikacja analizuje podane przez Ciebie informacje o osobie obdarowanej 
              (wiek, płeć, zainteresowania, okazja, budżet) i na tej podstawie generuje listę 
              najlepiej dopasowanych pomysłów na prezenty.
            </p>
            <p>
              Możesz skorzystać z dwóch trybów:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Formularz szczegółowy</strong> - wypełnij wszystkie kryteria, 
                a AI dopasuje prezenty maksymalnie precyzyjnie
              </li>
              <li>
                <strong>Opis swobodny</strong> - opisz swoimi słowami osobę lub sytuację, 
                a AI zrozumie kontekst i zaproponuje odpowiednie prezenty
              </li>
              <li>
                <strong>Losuj prezent</strong> - otrzymaj kreatywne, popularne propozycje 
                bez podawania szczegółów
              </li>
            </ul>
          </div>
        </div>
        
        {/* Technologia */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🤖 Technologia
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              Aplikacja wykorzystuje zaawansowane modele językowe OpenAI (GPT-4o-mini), 
              które potrafią zrozumieć kontekst i generować trafne, kreatywne propozycje prezentów.
            </p>
            <p>
              Przy doborze prezentów AI uwzględnia:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Popularność i trendy w 2025 roku</li>
              <li>Opinie użytkowników i oceny produktów</li>
              <li>Dopasowanie do osobowości i zainteresowań</li>
              <li>Budżet i dostępność</li>
              <li>Okazję i kontekst społeczny</li>
            </ul>
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
              <strong>To są jedynie propozycje oparte na AI:</strong> Wszystkie sugestie prezentów 
              są generowane automatycznie przez sztuczną inteligencję. Nie gwarantujemy, że każdy 
              prezent będzie idealnie dopasowany - AI może się mylić.
            </p>
            <p>
              <strong>Weryfikuj przed zakupem:</strong> Przed dokonaniem zakupu zawsze sprawdź:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Czy produkt faktycznie istnieje i jest dostępny</li>
              <li>Aktualne ceny i opinie</li>
              <li>Czy prezent na pewno będzie odpowiedni dla obdarowanej osoby</li>
            </ul>
            <p>
              <strong>Linki afiliacyjne:</strong> Linki do sklepów mogą być linkami afiliacyjnymi. 
              W wersji MVP linki prowadzą do wyszukiwania produktu w sklepie - nie zawsze będzie to 
              dokładnie ten sam produkt/oferta. W pełnej wersji będą to bezpośrednie linki do konkretnych ofert.
            </p>
            <p>
              <strong>Prywatność:</strong> Nie zbieramy danych osobowych. Ulubione prezenty są 
              zapisywane lokalnie w Twojej przeglądarce (localStorage).
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
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-semibold">Losuj prezent</h4>
                <p className="text-sm text-gray-600">
                  Kreatywne, popularne propozycje bez formularza
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
                <h4 className="font-semibold">Generator bloga SEO</h4>
                <p className="text-sm text-gray-600">
                  Twórz artykuły blogowe przez AI
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-semibold">Porównanie cen</h4>
                <p className="text-sm text-gray-600">
                  Zobacz ceny w różnych sklepach (MVP: mock)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold">Linki do sklepów</h4>
                <p className="text-sm text-gray-600">
                  Bezpośrednie linki zakupowe (MVP: przykładowe)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dane kontaktowe - SZABLON */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📧 Kontakt
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              Masz pytania, sugestie lub chcesz zgłosić problem? Skontaktuj się z nami:
            </p>
            <div className="bg-gray-50 p-4 rounded border-l-4 border-primary-500">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Administrator strony:</strong>
              </p>
              <p className="text-sm">
                <strong>Email:</strong> <span className="text-primary-600">[TU WPISZ EMAIL]</span>
              </p>
              <p className="text-sm">
                <strong>Telefon:</strong> <span className="text-primary-600">[TU WPISZ TELEFON]</span>
              </p>
              <p className="text-sm">
                <strong>Adres:</strong> <span className="text-primary-600">[TU WPISZ ADRES]</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Odpowiadamy na wiadomości w ciągu 24-48 godzin (dni robocze).
            </p>
          </div>
        </div>
      </Section>
      
      {/* Wersja MVP */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>ℹ️ To jest wersja MVP (Minimum Viable Product):</strong> Aplikacja jest 
            w fazie testowej. Niektóre funkcje (jak porównywanie cen czy linki afiliacyjne) 
            używają danych przykładowych. Pełna wersja zostanie uruchomiona po pozytywnym 
            odbiorze MVP.
          </p>
        </div>
      </div>
    </div>
  );
}
