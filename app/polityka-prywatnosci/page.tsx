import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Metadata dla SEO
export const metadata: Metadata = {
  title: 'Polityka Prywatności',
  description: 'Polityka prywatności serwisu Pomocnik Prezentowy AI - informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
};

// Treść polityki prywatności (skopiowana z POLITYKA_PRYWATNOSCI.md)
const politykaContent = `# Polityka prywatności serwisu "Pomocnik Prezentowy AI"

_Data dokumentu: 29.11.2025 r._

## 1. Administrator danych

Administratorem danych osobowych użytkowników serwisu **"Pomocnik Prezentowy AI"** jest:

> Łukasz Sachmerda
> email: sachmerda@gmail.com

## 2. Zakres przetwarzanych danych

W ramach korzystania z serwisu przetwarzane są następujące dane:

1. Dane podawane dobrowolnie w formularzu generowania propozycji prezentów:
   - okazja (np. urodziny, święta),
   - płeć obdarowywanej osoby,
   - wiek (lub przedział wiekowy),
   - relacja (np. żona, mąż, przyjaciółka itp.),
   - zainteresowania (słowa kluczowe),
   - preferencje dotyczące stylu prezentu.

2. Dane techniczne związane z korzystaniem z aplikacji (logi serwera):
   - adres IP urządzenia,
   - data i czas zapytania,
   - informacje o przeglądarce i systemie operacyjnym,
   - adres wywoływanego endpointu (np. \`/api/generuj\`, \`/api/allegro/search\`).

Serwis **nie** przetwarza danych umożliwiających bezpośrednią identyfikację konkretnej osoby (np. imię i nazwisko obdarowywanego, PESEL itd.).

## 3. Cel i podstawa przetwarzania danych

Dane przetwarzane są w następujących celach:

1. **Generowanie propozycji prezentów** – dane z formularza służą do przygotowania listy sugestii prezentowych z wykorzystaniem:
   - modeli sztucznej inteligencji (OpenAI),
   - ofert produktów z serwisu Allegro (poprzez Allegro API),
   - wyszukiwarki propozycji w innych sklepach na podstawie kategorii.

2. **Zapewnienie poprawnego działania aplikacji i bezpieczeństwa** – dane techniczne (logi serwera) są używane do:
   - monitorowania poprawności działania serwisu,
   - diagnozowania błędów,
   - ochrony przed nadużyciami i atakami.

Podstawą prawną przetwarzania danych jest:

- **art. 6 ust. 1 lit. b RODO** – przetwarzanie jest niezbędne do świadczenia usługi drogą elektroniczną (umożliwienie korzystania z funkcji serwisu),
- **art. 6 ust. 1 lit. f RODO** – prawnie uzasadniony interes administratora (zapewnienie bezpieczeństwa, zapobieganie nadużyciom, prowadzenie statystyk korzystania z serwisu).

## 4. Korzystanie z zewnętrznych usługodawców (podmioty przetwarzające)

W ramach działania serwisu korzystamy z usług zewnętrznych dostawców:

1. **Allegro.pl sp. z o.o.** – integracja z Allegro REST API:
   - aplikacja wysyła do Allegro zapytania dotyczące ofert produktów na podstawie słów kluczowych i budżetu,
   - w odpowiedzi otrzymuje listę publicznie dostępnych ofert (ID oferty, nazwa, cena, miniaturka, link do oferty itp.),
   - dane te są używane wyłącznie w celu prezentacji propozycji użytkownikowi.

2. **OpenAI / dostawca modeli AI** – integracja z API modelu językowego:
   - do API przesyłany jest opis sytuacji prezentowej (np. okazja, zainteresowania, preferencje),
   - model AI przetwarza te dane i zwraca zoptymalizowane propozycje prezentów,
   - nie przesyłamy do modelu danych identyfikujących konkretną osobę.

3. **Dostawcy infrastruktury serwerowej / hostingowej** – serwis może być utrzymywany na infrastrukturze zewnętrznego dostawcy (np. dostawca hostingu, chmura obliczeniowa). Dostawca ten ma potencjalny dostęp do danych zapisanych na serwerach, ale przetwarza je zgodnie z zawartą umową powierzenia.

## 5. Okres przechowywania danych

Dane przetwarzane są przez następujące okresy:

1. Dane z formularza wykorzystywane do wygenerowania propozycji prezentów:
   - przechowywane są przez czas niezbędny do obsługi zapytania oraz do celów statystycznych i analitycznych – maksymalnie **12 miesięcy** od daty ich wprowadzenia.

2. Dane techniczne (logi serwera):
   - przechowywane są przez okres maksymalnie **24 miesięcy** w celu zapewnienia bezpieczeństwa i możliwości analizy zdarzeń w systemie.

Po upływie powyższych okresów dane są usuwane lub anonimizowane.

## 6. Prawa użytkownika

Użytkownikom przysługują następujące prawa związane z przetwarzaniem danych osobowych:

- prawo dostępu do danych,
- prawo sprostowania danych,
- prawo usunięcia danych ("prawo do bycia zapomnianym"),
- prawo ograniczenia przetwarzania,
- prawo wniesienia sprzeciwu wobec przetwarzania,
- prawo wniesienia skargi do organu nadzorczego (Prezesa Urzędu Ochrony Danych Osobowych).

W celu realizacji swoich praw możesz skontaktować się z administratorem danych pod adresem e-mail wskazanym w sekcji 1.

## 7. Dobrowolność podania danych

Podanie danych w formularzu jest **dobrowolne**, ale niezbędne do skorzystania z funkcji generowania propozycji prezentów. Bez podania danych aplikacja nie będzie w stanie przygotować spersonalizowanych sugestii.

## 8. Pliki cookies

Serwis może wykorzystywać pliki cookies (ciasteczka) w celu:

- zapewnienia prawidłowego działania strony (cookies techniczne),
- zapamiętywania wybranych ustawień użytkownika (np. preferencje językowe),
- prowadzenia anonimowych statystyk odwiedzin.

Informacje o stosowanych cookies oraz możliwości ich konfiguracji za pomocą ustawień przeglądarki znajdują się w odrębnym dokumencie lub sekcji dotyczącej cookies na stronie.

## 9. Profilowanie i zautomatyzowane podejmowanie decyzji

W ramach serwisu stosowane jest profilowanie w znaczeniu potocznym – aplikacja na podstawie podanych danych (np. wiek, zainteresowania, okazja) generuje dopasowane propozycje prezentów. Nie jest to jednak profilowanie wywołujące skutki prawne wobec użytkownika w rozumieniu art. 22 RODO.

Użytkownik może w każdej chwili zaprzestać korzystania z serwisu, a jego dane zostaną usunięte po upływie okresów wskazanych w sekcji 5.

## 10. Bezpieczeństwo danych

Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych, w szczególności przed ich utratą, modyfikacją, nieuprawnionym dostępem lub ujawnieniem. Dane przesyłane do serwisu powinny być chronione poprzez szyfrowanie (HTTPS) po uruchomieniu produkcyjnym.

## 11. Zmiany w polityce prywatności

Polityka prywatności może być aktualizowana w celu dostosowania do zmian w przepisach prawa oraz zmian w funkcjonowaniu serwisu.

O istotnych zmianach użytkownicy będą informowani poprzez opublikowanie nowej wersji dokumentu na stronie serwisu.`;

export default function PolitykaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-purple-600 transition-colors">
            Strona główna
          </a>
          <span>›</span>
          <span className="text-purple-600 font-medium">Polityka prywatności</span>
        </div>

        {/* Kontener z treścią */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Stylowanie Markdown */}
          <div className="prose prose-lg max-w-none
            prose-headings:font-poppins
            prose-h1:text-4xl prose-h1:font-bold prose-h1:text-gray-900 prose-h1:mb-8 prose-h1:mt-0
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-purple-900 prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-purple-800 prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
            prose-ul:my-6 prose-ul:ml-6 prose-ul:space-y-2
            prose-ol:my-6 prose-ol:ml-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-600 prose-em:italic
            prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:bg-purple-50/30 prose-blockquote:italic prose-blockquote:text-gray-700
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {politykaContent}
            </ReactMarkdown>
          </div>

          {/* Przycisk powrotu */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              ← Powrót do strony głównej
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
