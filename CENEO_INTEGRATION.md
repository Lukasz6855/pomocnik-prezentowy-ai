# Integracja z Ceneo API

## Przegląd

Aplikacja **Pomocnik Prezentowy AI** wykorzystuje oficjalne API Ceneo (PartnerService) do wyszukiwania produktów i generowania linków afiliacyjnych z Twoim Partner ID.

### Cechy integracji:
- ✅ **OAuth 2.0** - Bezpieczna autoryzacja z tokenami Bearer
- ✅ **Cache 24h** - Zmniejszenie liczby zapytań API
- ✅ **Linki afiliacyjne** - Automatyczne dodawanie Partner ID (#pid=YOUR_PARTNER_ID)
- ✅ **Ranking produktów** - Wybór najlepszych ofert (popularność + rating + opinie)
- ✅ **Obrazy bez CORS** - Bezpośrednie ładowanie miniaturek z Ceneo

---

## 1. Wymagania

### Rejestracja w programie partnerskim Ceneo

1. Zarejestruj się: [https://www.ceneo.pl/Program_partnerski.xml](https://www.ceneo.pl/Program_partnerski.xml)
2. Wypełnij formularz z danymi strony (podaj URL wdrożenia Vercel)
3. Oczekuj weryfikacji (3-7 dni roboczych)
4. Po zatwierdzeniu otrzymasz:
   - **API Key** (klucz testowy na 90 dni)
   - **Partner ID** (w panelu konta, sekcja Ustawienia)

---

## 2. Konfiguracja

### Zmienne środowiskowe

Dodaj do pliku `.env`:

```env
# Ceneo API
CENEO_API_KEY=your-api-key-here
CENEO_PARTNER_ID=your-partner-id
```

**⚠️ Ważne:**
- `CENEO_API_KEY` to klucz OAuth otrzymany od Ceneo
- `CENEO_PARTNER_ID` to Twój Partner ID (otrzymany z programu partnerskiego Ceneo)
- Plik `.env` jest w `.gitignore` - nie trafi do repozytorium

---

## 3. Architektura

### Pliki projektu

```
lib/
├── ceneoClient.ts           # Klient API Ceneo (OAuth, wyszukiwanie)
└── types.ts                 # Typy TypeScript (Prezent, ShopLink)

app/api/
├── ceneo/lookup/route.ts    # Endpoint do wyszukiwania produktu
└── generuj/route.ts         # Generator prezentów (używa Ceneo)

components/
└── GiftCard.tsx             # Komponent karty prezentu (linki afiliacyjne)
```

### Flow danych

```
1. User wypełnia formularz
   ↓
2. POST /api/generuj
   ↓
3. Wyszukiwanie w Ceneo API (searchProducts)
   ↓
4. AI wybiera 5 najlepszych produktów
   ↓
5. Generowanie linków afiliacyjnych (#pid=YOUR_PARTNER_ID)
   ↓
6. Frontend renderuje GiftCard z przyciskiem "Zobacz w Ceneo"
```

---

## 4. API Ceneo - Szczegóły

### Autoryzacja OAuth 2.0

```typescript
// Automatyczne w lib/ceneoClient.ts
const token = await getAccessToken();

// Token cachowany przez 15 minut (zgodnie z dokumentacją Ceneo)
```

### Wyszukiwanie produktów

```typescript
import { searchProducts } from '@/lib/ceneoClient';

const products = await searchProducts('zabawka', {
  lowestPrice: 50,
  highestPrice: 200,
  pageSize: 10,
});
```

**Parametry:**
- `searchText` - fraza (wymagane)
- `categoryId` - ID kategorii (opcjonalne)
- `lowestPrice` - min cena w PLN (opcjonalne)
- `highestPrice` - max cena w PLN (opcjonalne)
- `pageSize` - liczba wyników (domyślnie: 10)

**Odpowiedź:**
```typescript
[
  {
    Id: 123456,
    Name: "Zabawka edukacyjna",
    LowestPrice: 99.99,
    Rating: 4.5,
    ProductReviews: 120,
    ThumbnailUrl: "https://...",
    Url: "https://www.ceneo.pl/123456",
    // ... więcej pól
  }
]
```

### Ranking produktów

Funkcja `lookupProduct()` wybiera najlepszy produkt według:
1. **Popularity** (1 = top 10, 2 = top 30, 3 = top 100, 4 = poza top 100)
2. **Rating** (ocena użytkowników)
3. **ProductReviews** (liczba opinii)

### Linki afiliacyjne

```typescript
import { generateAffiliateUrl } from '@/lib/ceneoClient';

const url = "https://www.ceneo.pl/123456";
const affiliateUrl = generateAffiliateUrl(url);
// Wynik: "https://www.ceneo.pl/123456#pid=YOUR_PARTNER_ID"
```

**Format:**
- `{productUrl}#pid={PARTNER_ID}`
- Tracking: Ceneo zlicza kliknięcia i konwersje

---

## 5. Endpoint /api/ceneo/lookup

### GET Request

```
GET /api/ceneo/lookup?query=laptop&minPrice=2000&maxPrice=5000
```

**Query params:**
- `query` - nazwa produktu (wymagane)
- `minPrice` - min cena (opcjonalne)
- `maxPrice` - max cena (opcjonalne)

### Response (Success)

```json
{
  "success": true,
  "product": {
    "productId": "123456",
    "name": "Laptop Dell XPS 15",
    "imageUrl": "https://image.ceneo.pl/...",
    "lowestPrice": 4999.99,
    "affiliateUrl": "https://www.ceneo.pl/123456#pid=YOUR_PARTNER_ID"
  },
  "cached": false
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "Nie znaleziono produktu w Ceneo",
  "query": "laptop"
}
```

---

## 6. Cache

### Strategia cache

- **Czas życia:** 24 godziny
- **Mechanizm:** In-memory Map (server-side)
- **Klucz:** `query|minPrice|maxPrice`
- **Cleanup:** Auto-usuwanie po przekroczeniu 1000 wpisów

### Przykład

```typescript
// Pierwsze wywołanie - API request
await getCachedProduct('laptop', { min: 2000, max: 5000 });
// [Ceneo Cache] MISS dla: laptop
// Token OAuth, API call, parsing...

// Drugie wywołanie (w ciągu 24h) - z cache
await getCachedProduct('laptop', { min: 2000, max: 5000 });
// [Ceneo Cache] HIT dla: laptop
// Instant response
```

---

## 7. Limity i koszty

### Ceneo API Limits

- **Klucz testowy:** 90 dni
- **Rate limiting:** ~100 requestów/dzień (zalecane)
- **Cache:** 15 minut (dane Ceneo)
- **Timeout tokenu:** 900s (15 minut)

### Nasza optymalizacja

- Cache 24h → max 100 unique queries/dzień
- Token cache → oszczędność 90% requestów autoryzacyjnych
- Batch search → 10 produktów/query

---

## 8. Frontend - GiftCard

### Wyświetlanie linków Ceneo

```tsx
<a
  href={link.url}
  target="_blank"
  rel="nofollow sponsored noopener noreferrer"
  className="..."
>
  🏷️ Zobacz w Ceneo ✓
</a>
```

**Atrybuty rel:**
- `nofollow` - Nie przekazuj PageRank (SEO)
- `sponsored` - Link sponsorowany/afiliacyjny
- `noopener noreferrer` - Bezpieczeństwo

---

## 9. Testowanie

### Test 1: OAuth Token

```bash
curl -H "Authorization: Basic YOUR_API_KEY" \
  "https://partnerzyapi.ceneo.pl/AuthorizationService.svc/GetToken?grantType='client_credentials'"
```

**Oczekiwana odpowiedź (headers):**
```
access_token: 8aYW5u...
expires_in: 900
token_type: bearer
```

### Test 2: Wyszukiwanie produktów

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://partnerzyapi.ceneo.pl/PartnerService.svc/GetProducts?searchtext='laptop'&$format=json"
```

### Test 3: Endpoint lookup

```bash
curl "http://localhost:3000/api/ceneo/lookup?query=laptop"
```

---

## 10. Troubleshooting

### Błąd: "CENEO_API_KEY nie jest ustawiony"

**Rozwiązanie:**
1. Sprawdź plik `.env`
2. Upewnij się że klucz jest bez cudzysłowów
3. Restart dev server: `npm run dev`

### Błąd: "401 Unauthorized"

**Możliwe przyczyny:**
- Nieprawidłowy API key
- Wygasły token (auto-refresh po 15 min)
- Testowy klucz wygasł (90 dni)

### Błąd: "404 Not Found" (brak produktów)

**Możliwe przyczyny:**
- Zbyt wąski zakres cenowy
- Fraza bez wyników
- Produkt w kategorii restricted (IsRestricted=true)

### Błąd: "403 Forbidden"

**Przyczyna:** Przekroczono limity API

**Rozwiązanie:**
- Sprawdź cache hit rate
- Ogranicz liczbę unique queries
- Zwiększ TTL cache

---

## 11. Produkcja (Vercel)

### Deployment

1. Dodaj zmienne środowiskowe w Vercel:
   ```
   Settings → Environment Variables
   CENEO_API_KEY=...
   CENEO_PARTNER_ID=your-partner-id
   ```

2. Redeploy:
   ```bash
   git push origin main
   ```

3. Verify:
   ```
   https://twoja-domena.vercel.app/api/ceneo/lookup?query=test
   ```

---

## 12. Monitoring

### Logi serwera

```bash
# Developement
npm run dev

# Produkcja (Vercel)
vercel logs
```

**Kluczowe komunikaty:**
```
[Ceneo] Nowy token OAuth otrzymany
[Ceneo] Znaleziono produktów: 10 dla: laptop
[Ceneo Cache] HIT dla: laptop
[Ceneo Cache] MISS dla: tablet
```

---

## 13. Dokumentacja Ceneo

- **Portal programu:** [https://partnerzy.ceneo.pl/](https://partnerzy.ceneo.pl/)
- **Dokumentacja API:** [https://partnerzyapi.ceneo.pl/Help/Service?name=PartnerService](https://partnerzyapi.ceneo.pl/Help/Service?name=PartnerService)
- **Rejestracja:** [https://www.ceneo.pl/Program_partnerski.xml](https://www.ceneo.pl/Program_partnerski.xml)

---

## 14. FAQ

**Q: Czy mogę używać Allegro i Ceneo jednocześnie?**  
A: Tak, ale obecnie aplikacja używa tylko Ceneo. Możesz dodać Allegro jako drugi sklep w `shop_links[]`.

**Q: Jak zmienić Partner ID?**  
A: Edytuj `CENEO_PARTNER_ID` w `.env` lub bezpośrednio w `lib/ceneoClient.ts` (linia 32).

**Q: Czy obrazy z Ceneo działają bez CORS?**  
A: Tak, Ceneo udostępnia obrazy publicznie. Nie potrzebujesz proxy (w przeciwieństwie do Allegro).

**Q: Co jeśli testowy klucz wygaśnie?**  
A: Skontaktuj się z Ceneo aby przedłużyć lub przejść na stały klucz produkcyjny.

---

**Ostatnia aktualizacja:** 02.12.2025  
**Wersja:** 1.0.0
