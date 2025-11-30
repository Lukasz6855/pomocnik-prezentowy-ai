# 🚀 Instrukcja Wdrożenia na Vercel

## ✅ Przygotowania zakończone!

Projekt jest gotowy do wdrożenia. Wszystkie kroki przygotowawcze wykonane:

- ✅ Usunięto Prisma i SQLite (nie potrzebne - używamy localStorage)
- ✅ Ukryto klucze API (.env w .gitignore)
- ✅ Dodano pełne SEO (robots.txt, sitemap, Open Graph, favicon)
- ✅ Utworzono stronę polityki prywatności
- ✅ Zintegrowano Google Analytics (opcjonalne)
- ✅ Build produkcyjny działa bez błędów

---

## 📋 KROK PO KROKU - Wdrożenie na Vercel

### **KROK 1: Wypchnij kod na GitHub**

```powershell
# Inicjalizacja repozytorium (jeśli jeszcze nie masz)
git init
git add .
git commit -m "Przygotowanie do wdrożenia produkcyjnego"

# Utwórz repo na GitHub: https://github.com/new
# Nazwa: pomocnik-prezentowy-ai

# Połącz z GitHub
git remote add origin https://github.com/TWOJA_NAZWA/pomocnik-prezentowy-ai.git
git branch -M main
git push -u origin main
```

**UWAGA:** Plik `.env` NIE zostanie wysłany (jest w `.gitignore`). To dobrze! Klucze API dodasz bezpiecznie w Vercel.

---

### **KROK 2: Zarejestruj się na Vercel**

1. Wejdź na: **https://vercel.com**
2. Kliknij **"Sign Up"**
3. Wybierz **"Continue with GitHub"**
4. Autoryzuj Vercel do dostępu do Twoich repozytoriów

---

### **KROK 3: Import projektu**

1. W dashboardzie Vercel kliknij **"Add New Project"**
2. Wybierz repo: **`pomocnik-prezentowy-ai`**
3. Framework Preset: **Next.js** (powinno się wykryć automatycznie)
4. Root Directory: **`.`** (katalog główny)
5. Build Command: `npm run build` (domyślne)
6. Output Directory: `.next` (domyślne)

---

### **KROK 4: Dodaj zmienne środowiskowe**

**WAŻNE!** Przed kliknięciem "Deploy", dodaj zmienne:

Kliknij **"Environment Variables"** i dodaj:

| Nazwa                    | Wartość                                                      |
|--------------------------|--------------------------------------------------------------|
| `OPENAI_API_KEY`         | `sk-proj-your-openai-api-key-here` |
| `LLM_MODEL`              | `gpt-4o-mini`                                                |
| `ALLEGRO_CLIENT_ID`      | `your-allegro-client-id`                           |
| `ALLEGRO_CLIENT_SECRET`  | `your-allegro-client-secret` |
| `ALLEGRO_API_URL`        | `https://api.allegro.pl`                                     |
| `ALLEGRO_AUTH_URL`       | `https://allegro.pl/auth/oauth/token`                        |
| `NEXT_PUBLIC_GA_ID`      | `G-XXXXXXXXXX` *(opcjonalne - dodaj po utworzeniu konta w Google Analytics)* |

**Ustaw dla wszystkich środowisk:** Production, Preview, Development

---

### **KROK 5: Deploy!**

1. Kliknij **"Deploy"**
2. Vercel automatycznie:
   - Zainstaluje zależności (`npm install`)
   - Zbuduje projekt (`npm run build`)
   - Wystawi stronę na domenie Vercel

3. Po ~2-3 minutach zobaczysz:
   ```
   ✅ Deployment Ready!
   🌍 https://pomocnik-prezentowy-ai.vercel.app
   ```

4. **Otwórz link i przetestuj stronę!** 🎉

---

### **KROK 6: Podłącz własną domenę**

#### A. Kup domenę (jeśli nie masz)

Rekomendacje:
- **OVH.pl** (~30 zł/rok za .pl)
- **home.pl** (~40 zł/rok)
- **Cloudflare** (~10 USD/rok)
- **Namecheap** (~15 USD/rok)

#### B. Skonfiguruj DNS w Vercel

1. W projekcie na Vercel → **Settings** → **Domains**
2. Kliknij **"Add Domain"**
3. Wpisz swoją domenę: `pomocnikprezentowy.pl`
4. Vercel poda Ci rekordy DNS do dodania:

   **Przykład:**
   ```
   Typ: A
   Nazwa: @
   Wartość: 76.76.21.21

   Typ: CNAME
   Nazwa: www
   Wartość: cname.vercel-dns.com
   ```

#### C. Dodaj rekordy w panelu dostawcy domeny

1. Zaloguj się do panelu OVH/home.pl/Cloudflare
2. Znajdź **"Strefy DNS"** lub **"DNS Management"**
3. Dodaj rekordy podane przez Vercel:
   - Rekord **A** dla `@` → `76.76.21.21`
   - Rekord **CNAME** dla `www` → `cname.vercel-dns.com`

4. Zapisz zmiany

#### D. Czekaj na propagację DNS

- Czas: **5-60 minut** (czasem do 24h)
- Sprawdź status: https://dnschecker.org
- Po propagacji strona będzie dostępna pod Twoją domeną!

#### E. SSL (HTTPS)

Vercel **automatycznie** wygeneruje certyfikat SSL (Let's Encrypt).
Twoja strona będzie dostępna na: `https://pomocnikprezentowy.pl` 🔒

---

## 🔧 Konfiguracja Google Analytics (opcjonalne)

Jeśli chcesz śledzić ruch:

1. Utwórz konto: **https://analytics.google.com**
2. Dodaj nową właściwość (property)
3. Skopiuj **Measurement ID** (format: `G-XXXXXXXXXX`)
4. W Vercel → **Settings** → **Environment Variables**
5. Dodaj zmienną:
   ```
   NEXT_PUBLIC_GA_ID = G-TWOJ-ID-TUTAJ
   ```
6. Redeploy projekt (Vercel → **Deployments** → **...** → **Redeploy**)

---

## 📊 Po Wdrożeniu

### Sprawdź czy wszystko działa:

✅ **Strona główna** - formularz generowania prezentów  
✅ **Blog** - artykuły + wyszukiwarka  
✅ **Ulubione** - localStorage  
✅ **Polityka prywatności** - `/polityka-prywatnosci`  
✅ **SEO** - sprawdź `view-source:` i meta tagi  
✅ **Obrazki** - proxy działa dla Allegro  

### Monitoruj ruch:

- **Vercel Analytics** (wbudowane w darmowy tier)
- **Google Analytics** (jeśli dodałeś)
- **Google Search Console** - zgłoś stronę: https://search.google.com/search-console

---

## 🎯 Następne Kroki (Opcjonalne)

1. **Więcej artykułów na blogu:**
   - Dodaj pliki JSON do `/articles/`
   - Wzór: `articles/10-najlepszych-pomyslow-na-prezent-na-swieta-2025.json`

2. **Weryfikacja Allegro API:**
   - Zgłoś aplikację na GitHub Issues: https://github.com/allegro/allegro-api/issues
   - Dołącz link do polityki prywatności: `https://pomocnikprezentowy.pl/polityka-prywatnosci`

3. **Marketing:**
   - Udostępnij na LinkedIn/Facebook
   - Dodaj do Product Hunt
   - Prowadź blog regularnie (SEO!)

---

## 🆘 Pomoc i Wsparcie

### Częste problemy:

**Problem:** Build failuje na Vercel  
**Rozwiązanie:** Sprawdź logi buildu, upewnij się że wszystkie zmienne środowiskowe są dodane

**Problem:** Allegro API zwraca błąd 403  
**Rozwiązanie:** To normalne - czekaj na weryfikację od Allegro

**Problem:** Google Analytics nie działa  
**Rozwiązanie:** Sprawdź czy `NEXT_PUBLIC_GA_ID` jest ustawione i czy ma prefix `NEXT_PUBLIC_`

**Problem:** Obrazki się nie ładują  
**Rozwiązanie:** Sprawdź `/api/proxy-image` - powinno działać automatycznie

---

## 📞 Kontakt

Jeśli potrzebujesz pomocy z wdrożeniem:
- Discord Vercel: https://vercel.com/discord
- Dokumentacja Next.js: https://nextjs.org/docs/deployment

---

**Powodzenia! 🚀🎁**
