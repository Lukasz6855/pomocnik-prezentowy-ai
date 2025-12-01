# 🎁 Pomocnik Prezentowy AI

Inteligentny asystent w wyborze idealnego prezentu wykorzystujący sztuczną inteligencję OpenAI GPT-4o-mini i integrację z Ceneo API (w toku).

## 📋 Spis treści

- [Opis projektu](#opis-projektu)
- [Funkcje aplikacji](#funkcje-aplikacji)
- [Technologie](#technologie)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Konfiguracja](#konfiguracja)
- [Struktura projektu](#struktura-projektu)
- [API Endpoints](#api-endpoints)
- [Blog](#blog)
- [Rozwój projektu](#rozwój-projektu)
- [Wdrożenie](#wdrożenie)

## 🎯 Opis projektu

**Pomocnik Prezentowy AI** to aplikacja webowa stworzona w Next.js 14, która pomaga użytkownikom w znalezieniu idealnego prezentu na podstawie:
- Szczegółowego formularza z danymi o obdarowanej osobie
- Swobodnego opisu tekstowego
- Losowania kreatywnych, popularnych prezentów

Aplikacja wykorzystuje:
- **OpenAI API** do generowania spersonalizowanych propozycji
- **Ceneo API** do porównywania cen i wyszukiwania ofert (integracja w toku - oczekiwanie na zatwierdzenie w programie partnerskim)
- **9 sklepów** z linkami do wyszukiwania (Allegro, Empik, Reserved, Vistula, itp.)

## ✨ Funkcje aplikacji

### 🎯 Wyszukiwarka prezentów
- **Formularz szczegółowy**: Wybór okazji, płci, relacji, wieku, zainteresowań, stylu, formy prezentu i budżetu
- **Opis swobodny**: Opis osoby lub sytuacji własnymi słowami
- **Losuj prezent**: Generowanie kreatywnych, popularnych propozycji bez wypełniania formularza
- **Integracja z Ceneo API**: Porównywanie cen i ofert produktów (w toku - oczekiwanie na weryfikację w programie partnerskim)
- **Inne sklepy**: Linki do wyszukiwania w 9 sklepach internetowych

### ❤️ Ulubione
- Zapisywanie ulubionych prezentów w `localStorage`
- Zarządzanie listą ulubionych (dodawanie/usuwanie)
- Brak potrzeby logowania (dane tylko w przeglądarce)
- Persistence między sesjami

### 📝 Blog
- Statyczne artykuły wczytywane z folderu `/articles`
- Format JSON + Markdown dla łatwej edycji
- Wyszukiwarka artykułów (live filtering)
- Paginacja (12 artykułów na stronę)
- Pełne SEO (metadata, Open Graph, Schema.org, JSON-LD)

### 🎨 Dodatkowe funkcje
- Proxy dla obrazków z zewnętrznych źródeł (bez CORS)
- Responsywny design (mobile-first)
- Minimalistyczny, elegancki UI z gradientami purple/pink
- Polityka prywatności (RODO-compliant)
- Google Analytics (opcjonalne)
- Sitemap + robots.txt
- Dynamiczny Open Graph image generator
- Custom favicon

## 🛠 Technologie

- **Framework**: Next.js 14 (App Router)
- **Język**: TypeScript
- **Styling**: TailwindCSS
- **AI**: OpenAI API (GPT-4o-mini)
- **Integracje**: Ceneo API (w toku - oczekiwanie na weryfikację w programie partnerskim)
- **Markdown**: react-markdown + remark-gfm (dla bloga)
- **Zarządzanie stanem**: React Hooks + localStorage
- **Deployment**: Vercel

## 🚀 Instalacja i uruchomienie

### Wymagania wstępne

- Node.js 18.0 lub nowszy
- npm lub yarn
- Klucz API OpenAI ([utwórz tutaj](https://platform.openai.com/api-keys))
- Klucz API Ceneo (w toku - [program partnerski Ceneo](https://www.ceneo.pl/Program_partnerski.xml))

### Krok 1: Instalacja zależności

```bash
npm install
```

### Krok 2: Konfiguracja zmiennych środowiskowych

Skopiuj plik `.env.example` do `.env`:

```bash
copy .env.example .env
```

Edytuj plik `.env` i dodaj swoje klucze API:

```env
# OpenAI API
OPENAI_API_KEY=sk-your-api-key-here
LLM_MODEL=gpt-4o-mini

# Ceneo API (w toku - oczekiwanie na weryfikację)
# CENEO_API_KEY=your-ceneo-api-key-here

# Google Analytics (opcjonalne)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Ważne**: 
- Zarejestruj się w [programie partnerskim Ceneo](https://www.ceneo.pl/Program_partnerski.xml) (weryfikacja 3-7 dni)
- Pobierz klucz OpenAI z [OpenAI Platform](https://platform.openai.com/api-keys)
- Plik `.env` jest w `.gitignore` - nie trafi do repozytorium

### Krok 3: Uruchomienie aplikacji w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

### Krok 4: Build produkcyjny

```bash
npm run build
npm start
```

## ⚙️ Konfiguracja

### Zmiana modelu AI

W pliku `.env` zmień wartość `LLM_MODEL`:

```env
# Dostępne modele (przykłady):
LLM_MODEL=gpt-4o-mini        # Najtańszy, szybki (zalecany)
LLM_MODEL=gpt-4o             # Droższy, bardziej zaawansowany
LLM_MODEL=gpt-4-turbo        # Szybszy GPT-4
```

### Dodawanie artykułów na blog

Artykuły są przechowywane jako pliki JSON w folderze `/articles`:

1. Utwórz nowy plik JSON według wzoru: `articles/twoj-artykul.json`
2. Użyj struktury z `articles/README.md`
3. Treść artykułu pisz w Markdown (`contentMarkdown` field)
4. Obrazki możesz hostować na Unsplash lub innych serwisach
5. Artykuł automatycznie pojawi się na `/blog`

### Google Analytics

1. Utwórz property w [Google Analytics](https://analytics.google.com)
2. Skopiuj Measurement ID (format: `G-XXXXXXXXXX`)
3. Dodaj do `.env`:
   ```env
   NEXT_PUBLIC_GA_ID=G-TWOJ-ID
   ```

## 📁 Struktura projektu

```
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── generuj/route.ts      # Generator propozycji prezentów
│   │   └── proxy-image/route.ts  # Proxy dla obrazków
│   ├── blog/                     # Blog (artykuły statyczne)
│   │   ├── [slug]/page.tsx       # Strona pojedynczego artykułu
│   │   └── page.tsx              # Lista artykułów + wyszukiwarka
│   ├── o-stronie/page.tsx        # Strona informacyjna
│   ├── polityka-prywatnosci/     # Polityka prywatności RODO
│   │   └── page.tsx
│   ├── ulubione/page.tsx         # Strona ulubione prezenty
│   ├── globals.css               # Globalne style CSS
│   ├── icon.tsx                  # Favicon generator
│   ├── layout.tsx                # Root layout + SEO metadata
│   ├── opengraph-image.tsx       # Open Graph image generator
│   ├── robots.txt                # SEO - indeksowanie
│   ├── sitemap.ts                # SEO - mapa strony
│   └── page.tsx                  # Strona główna
├── articles/                     # Artykuły blogowe (JSON + Markdown)
│   ├── 10-najlepszych-pomyslow-na-prezent-na-swieta-2025.json
│   └── README.md                 # Instrukcja dodawania artykułów
├── components/                   # Komponenty React
│   ├── GiftCard.tsx              # Karta prezentu
│   ├── GoogleAnalytics.tsx       # Google Analytics tracking
│   ├── LoadingSpinner.tsx        # Spinner ładowania
│   ├── Navigation.tsx            # Nawigacja
│   ├── SearchBar.tsx             # Wyszukiwarka artykułów (blog)
│   └── Section.tsx               # Sekcja uniwersalna
├── lib/                          # Biblioteki i utility
│   ├── articlesLoader.ts         # Ładowanie artykułów z /articles
│   ├── llmProvider.ts            # Konfiguracja OpenAI
│   ├── otherShopsHelper.ts       # Linki do sklepów (9 sklepów)
│   └── types.ts                  # Typy TypeScript
├── .env                          # Zmienne środowiskowe (nie w repo!)
├── .env.example                  # Przykład zmiennych środowiskowych
├── .gitignore                    # Ignorowane pliki
├── next.config.js                # Konfiguracja Next.js
├── package.json                  # Zależności projektu
├── tailwind.config.ts            # Konfiguracja TailwindCSS
├── tsconfig.json                 # Konfiguracja TypeScript
├── DEPLOYMENT.md                 # Instrukcja wdrożenia na Vercel
├── POLITYKA_PRYWATNOSCI.md       # Polityka prywatności (źródło)
└── README.md                     # Ten plik
```

## 🔌 API Endpoints

### POST `/api/generuj`

Generuje propozycje prezentów na podstawie danych wejściowych.

**Body:**
```json
{
  "typ": "formularz" | "opis" | "losowy",
  "dane": {
    // Dla typu "formularz":
    "okazja": "urodziny",
    "plec": "kobieta",
    "relacja": "Mama",
    "wiek": "60 lat",
    "zainteresowania": ["Gotowanie", "Książki"],
    "stylPrezentu": "praktyczny",
    "formaPrezentu": ["rzeczowy"],
    "budzetOd": "100",
    "budzetDo": "300"
    
    // Dla typu "opis":
    // "opis": "Szukam prezentu dla mojej mamy..."
    
    // Dla typu "losowy": {} (puste)
  }
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "count": 10,
  "prezenty": [
    {
      "title": "Nazwa prezentu",
      "description": "Opis",
      "why": "Dlaczego pasuje",
      "price_estimate": "150-200 PLN",
      "imageUrl": "/api/proxy-image?url=...",
      "shop_links": [
        {
          "shop": "Allegro",
          "url": "https://allegro.pl/listing?string=...",
          "isConcreteOffer": false
        }
      ]
    }
  ]
}
```

### GET `/api/proxy-image`

Proxuje obrazki z zewnętrznych źródeł (omija CORS).

**Query params:**
```
?url=https://example.com/image.jpg
```

## 📝 Blog

Artykuły są przechowywane jako pliki JSON w folderze `/articles`:

### Struktura artykułu

```json
{
  "slug": "nazwa-artykulu",
  "title": "Tytuł artykułu",
  "excerpt": "Krótki opis (150-200 znaków)",
  "keywords": ["prezenty", "święta"],
  "thumbnail": "https://images.unsplash.com/...",
  "contentMarkdown": "# Nagłówek\n\nTreść w Markdown...",
  "date": "2025-11-30",
  "author": "Pomocnik Prezentowy AI",
  "metaDescription": "Opis dla SEO (opcjonalne)"
}
```

### Dodawanie nowych artykułów

1. Utwórz plik JSON w `/articles/slug-artykulu.json`
2. Użyj Markdown w polu `contentMarkdown`
3. Dodaj miniaturkę z Unsplash
4. Artykuł automatycznie pojawi się na `/blog`
5. Pełna instrukcja w `/articles/README.md`

## 🔮 Rozwój projektu

### Funkcje do dodania w przyszłości

- [ ] Dokończenie integracji z Ceneo API (oczekiwanie na weryfikację w programie partnerskim)
- [ ] Prawdziwe linki afiliacyjne (programy partnerskie)
- [ ] System logowania użytkowników
- [ ] Synchronizacja ulubionych między urządzeniami
- [ ] Historia wyszukiwań
- [ ] Udostępnianie list prezentów
- [ ] Panel CMS do zarządzania artykułami
- [ ] Newsletter
- [ ] Wielojęzyczność (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Testy jednostkowe i E2E

### Optymalizacja kosztów AI

Używamy `gpt-4o-mini` dla minimalizacji kosztów (~$0.002/zapytanie). Przy większym ruchu rozważ:
- Cachowanie popularnych zapytań
- Rate limiting
- Optymalizację promptów
- Fine-tuning modelu (dla zaawansowanych)

## 🚀 Wdrożenie

Pełna instrukcja wdrożenia na Vercel znajduje się w pliku **`DEPLOYMENT.md`**.

### Quick Start:

1. Wypchnij kod na GitHub (public repo)
2. Zarejestruj się na [Vercel](https://vercel.com)
3. Import projektu z GitHub
4. Dodaj zmienne środowiskowe (patrz: DEPLOYMENT.md)
5. Deploy! 🎉

**Koszt:** ~30 zł/rok (domena) + koszty API OpenAI

## ⚠️ Ważne uwagi

- **Ceneo API**: Integracja w toku - oczekiwanie na weryfikację w programie partnerskim (3-7 dni)
- **Weryfikuj propozycje AI**: AI może się mylić - zawsze sprawdzaj produkty przed zakupem
- **Koszty API**: Monitoruj użycie OpenAI API (~$0.002 na zapytanie)
- **Prywatność**: Dane przechowywane tylko w localStorage (brak bazy danych)
- **SEO**: Uzupełnij Google Analytics ID w `.env` dla trackingu ruchu
- **RODO**: Polityka prywatności dostępna pod `/polityka-prywatnosci`

## 📄 Dokumentacja

- **DEPLOYMENT.md** - Pełna instrukcja wdrożenia na Vercel
- **POLITYKA_PRYWATNOSCI.md** - Polityka prywatności (RODO)
- **articles/README.md** - Instrukcja dodawania artykułów na blog

## 📝 Licencja

Projekt MVP do celów edukacyjnych i komercyjnych.

## 🤝 Kontakt

W przypadku pytań lub problemów skontaktuj się z administratorem strony.

---

**Powered by OpenAI GPT-4o-mini + Ceneo API (w toku) + Next.js 14**

🎁 Znajdź idealny prezent w 30 sekund!
