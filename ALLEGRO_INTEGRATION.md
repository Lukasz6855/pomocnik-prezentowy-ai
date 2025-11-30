# 🎁 Integracja z Allegro API - Instrukcja Konfiguracji

## ✅ Co zostało zaimplementowane:

### 1. **Backend Allegro API**
- `lib/allegroClient.ts` - Klient OAuth2 + wyszukiwanie ofert
- `/api/allegro/search` - Endpoint wyszukiwania
- `/api/proxy-image` - Proxy dla miniatur (bez zapisywania na dysk)

### 2. **Nowa logika generowania**
- **5 ofert z Allegro** (prawdziwe produkty z API)
- **5 propozycji z innych sklepów** (linki do wyszukiwania: Vistula, Reserved, Empik, etc.)
- AI **NIE WYMYŚLA** modeli - tylko wybiera z Allegro lub podaje kategorię

### 3. **Komponenty UI**
- `GiftCard.tsx` - Przyciski tylko do sklepów z ofertą
- Miniaturki przez `/api/proxy-image`
- Badge "✅ Konkretna oferta z Allegro" lub "🔍 Wyszukiwanie w sklepie"

---

## 🔧 KROK 1: Konfiguracja Allegro API

### A. Utwórz aplikację w Allegro:
1. Wejdź na https://apps.developer.allegro.pl/
2. Zaloguj się kontem Allegro
3. Kliknij **"Nowa aplikacja"**
4. Wypełnij dane:
   - **Nazwa**: Pomocnik Prezentowy AI
   - **Redirect URL**: http://localhost:3001/auth/callback (lub twoja domena)
   - **Typ**: Web Application
5. Zapisz aplikację
6. Skopiuj:
   - **Client ID** (identyfikator klienta)
   - **Client Secret** (sekret klienta)

### B. Dodaj credentials do `.env.local`:

1. Skopiuj plik przykładowy:
```bash
cp .env.local.example .env.local
```

2. Otwórz `.env.local` i wklej swoje dane:
```env
# OpenAI API
OPENAI_API_KEY=sk-proj-twoj-klucz
LLM_MODEL=gpt-4o-mini

# Allegro API - WKLEJ SWOJE DANE TUTAJ:
ALLEGRO_CLIENT_ID=twoj_client_id_z_apps.developer.allegro.pl
ALLEGRO_CLIENT_SECRET=twoj_client_secret_z_apps.developer.allegro.pl
ALLEGRO_API_URL=https://api.allegro.pl
ALLEGRO_AUTH_URL=https://allegro.pl/auth/oauth/token
```

3. **WAŻNE**: Nie commituj `.env.local` do git!

---

## 🚀 KROK 2: Test integracji

### Test 1: Sprawdź czy Allegro API działa
```bash
# Uruchom serwer
npm run dev

# W nowej przeglądarce:
http://localhost:3001/api/allegro/search?phrase=książka

# Powinno zwrócić JSON z ofertami Allegro
```

### Test 2: Sprawdź proxy dla obrazków
```
http://localhost:3001/api/proxy-image?url=https://a.allegroimg.com/original/12dbed/e8cc57244b86ab7ebcc3e293ca0f

# Powinno pokazać obrazek
```

### Test 3: Wygeneruj propozycje prezentów
1. Otwórz http://localhost:3001
2. Wypełnij formularz
3. Kliknij "Znajdź prezenty"
4. Powinno pojawić się **10 propozycji**:
   - **5 z Allegro** (z miniaturkami, konkretnymi cenami, linkami)
   - **5 z innych sklepów** (kategorie, linki do wyszukiwania)

---

## 📋 KROK 3: Weryfikacja

### Sprawdź w konsoli przeglądarki (F12):
```
🎁 Generowanie prezentów: typ=formularz
🔍 Parametry: phrase="książki", budżet=50-200
🛒 Wyszukiwanie w Allegro...
✅ Znaleziono 10 ofert w Allegro
🤖 Wywołanie AI...
✅ Wygenerowano 10 propozycji
```

### Sprawdź karty prezentów:
- [x] Miniaturki się ładują (z Allegro)
- [x] Przycisk tylko "Allegro" (nie ma Amazon/Ceneo jeśli nie ma oferty)
- [x] Dla innych sklepów: "Zobacz w sklepie Vistula" etc.
- [x] Badge: "✅ Konkretna oferta z Allegro" lub "🔍 Wyszukiwanie..."

---

## ❌ Rozwiązywanie problemów

### Błąd: "Allegro API nie jest skonfigurowane"
**Rozwiązanie**: Sprawdź czy CLIENT_ID i CLIENT_SECRET są w `.env.local`

### Błąd: "Allegro auth failed: 401"
**Rozwiązanie**: 
- Sprawdź czy credentials są poprawne
- Sprawdź czy aplikacja jest aktywna w apps.developer.allegro.pl

### Błąd: "Allegro search failed: 403"
**Rozwiązanie**: 
- Sprawdź czy token OAuth2 jest aktualny (automatyczne odświeżanie)
- Sprawdź logi w konsoli: `🔐 Pobieranie nowego tokenu Allegro...`

### Nie ma miniaturek
**Rozwiązanie**:
- Sprawdź czy `/api/proxy-image` działa (test bezpośredni w przeglądarce)
- Sprawdź whitelist domen w `app/api/proxy-image/route.ts`

### AI wciąż wymyśla produkty
**Rozwiązanie**:
- Sprawdź czy Allegro API zwraca oferty (logi w konsoli)
- Jeśli Allegro nie zwraca wyników, AI będzie wymyślać
- Zwiększ budżet lub zmień słowa kluczowe

---

## 🎯 Workflow (jak to działa):

```
1. User wypełnia formularz
   ↓
2. Backend: Wyszukiwanie w Allegro API
   → phrase: "książka fantasy"
   → price: 50-200 PLN
   ↓
3. Allegro zwraca 10 realnych ofert
   ↓
4. Backend przekazuje oferty do AI
   ↓
5. AI wybiera 5 najlepszych z listy Allegro
   + generuje 5 kategorii dla innych sklepów
   ↓
6. Backend konwertuje wyniki:
   - Allegro: pełne dane + link do oferty
   - Inne: kategoria + link do wyszukiwania
   ↓
7. Frontend wyświetla 10 kart:
   - 5 z miniaturkami (Allegro)
   - 5 bez miniaturek (inne sklepy)
```

---

## 📝 Pliki które zostały zmienione:

```
NOWE:
✅ lib/allegroClient.ts
✅ lib/otherShopsHelper.ts
✅ app/api/allegro/search/route.ts
✅ app/api/proxy-image/route.ts
✅ .env.local.example

ZMODYFIKOWANE:
✅ app/api/generuj/route.ts (kompletna przebudowa)
✅ lib/types.ts (nowe pola: source, shopName, allegroId, realImageUrl)
✅ components/GiftCard.tsx (przyciski tylko do właściwych sklepów)
```

---

## 🎉 Gotowe!

Teraz Twoja aplikacja:
- ✅ Pobiera **prawdziwe oferty** z Allegro API
- ✅ AI **NIE WYMYŚLA** produktów
- ✅ Miniaturki działają przez proxy
- ✅ Przyciski tylko do sklepów z ofertą
- ✅ Mix Allegro (5) + inne sklepy (5) = różnorodność!

**Następne kroki (opcjonalne):**
- Dodaj więcej sklepów z API (Amazon Product Advertising API, Ceneo API)
- Dodaj kategoryzację (Allegro categories endpoint)
- Dodaj sorting po cenie/popularności
- Dodaj paginację dla więcej wyników
