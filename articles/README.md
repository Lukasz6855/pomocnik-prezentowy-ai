# 📝 Folder Artykułów Blogowych

Ten folder zawiera gotowe artykuły w formacie JSON, które są wyświetlane na stronie `/blog`.

## Jak dodać nowy artykuł?

1. Stwórz nowy plik JSON w tym folderze (np. `moj-artykul.json`)
2. Wypełnij go zgodnie z poniższym szablonem
3. Artykuł automatycznie pojawi się na blogu po odświeżeniu strony

## Szablon artykułu (struktura JSON):

```json
{
  "slug": "unikalny-identyfikator-url",
  "title": "Tytuł Artykułu",
  "excerpt": "Krótki opis artykułu (2-3 zdania). Wyświetlany na liście artykułów i w meta description.",
  "keywords": [
    "słowo kluczowe 1",
    "słowo kluczowe 2",
    "słowo kluczowe 3"
  ],
  "thumbnail": "https://przykladowy-url-do-obrazka.jpg",
  "date": "2025-11-29",
  "author": "Imię Nazwisko",
  "metaDescription": "Opis SEO artykułu (opcjonalne, domyślnie użyje excerpt)",
  "contentMarkdown": "# Nagłówek główny\n\nTreść artykułu w formacie Markdown...\n\n## Podsekcja\n\n- Lista\n- Punktowana\n\n**Pogrubiony tekst** i *kursywa*."
}
```

## Wyjaśnienie pól:

| Pole | Wymagane | Opis |
|------|----------|------|
| `slug` | ✅ Tak | Unikalny identyfikator URL (np. `najlepsze-prezenty-2025`). Bez polskich znaków, małe litery, myślniki zamiast spacji. |
| `title` | ✅ Tak | Tytuł artykułu wyświetlany na liście i na stronie artykułu. |
| `excerpt` | ✅ Tak | Krótki wstęp (2-3 zdania) wyświetlany na karcie artykułu. |
| `keywords` | ✅ Tak | Tablica słów kluczowych / tagów (wyświetlane jako kolorowe badge'y). |
| `thumbnail` | ✅ Tak | URL miniaturki artykułu (może być z Unsplash, Pexels lub własny obrazek). |
| `date` | ✅ Tak | Data publikacji w formacie ISO (YYYY-MM-DD). Artykuły sortowane po dacie (najnowsze na górze). |
| `author` | ❌ Nie | Imię autora artykułu (opcjonalne). |
| `metaDescription` | ❌ Nie | Opis SEO (opcjonalne, domyślnie użyje `excerpt`). |
| `contentMarkdown` | ✅ Tak | Pełna treść artykułu w formacie **Markdown**. |

## Format Markdown - podstawowe elementy:

```markdown
# Nagłówek H1
## Nagłówek H2
### Nagłówek H3

**Pogrubiony tekst**
*Kursywa*

- Lista
- Punktowana

1. Lista
2. Numerowana

[Link](https://example.com)

![Obrazek](https://url-do-obrazka.jpg)

> Cytat

`kod inline`

\`\`\`
Blok kodu
\`\`\`
```

## Przykład kompletnego artykułu:

Zobacz plik: `10-najlepszych-pomyslow-na-prezent-na-swieta-2025.json` w tym folderze.

## Źródła miniaturek (darmowe obrazki):

- [Unsplash](https://unsplash.com) - darmowe zdjęcia wysokiej jakości
- [Pexels](https://pexels.com) - darmowe zdjęcia i wideo
- [Pixabay](https://pixabay.com) - darmowe zdjęcia

## Generowanie artykułów przez AI:

Możesz użyć narzędzia AI (ChatGPT, Claude, własny skrypt) do generowania treści artykułów.

**Przykładowy prompt:**

```
Wygeneruj artykuł blogowy w formacie JSON zgodnie z tym szablonem:
{
  "slug": "...",
  "title": "...",
  "excerpt": "...",
  ...
}

Temat artykułu: "Najlepsze prezenty na Dzień Matki 2025"
Długość: ~1500 słów
Format: Markdown
```

---

## FAQ

**Q: Ile artykułów może być na jednej stronie?**  
A: 12 artykułów. Jeśli będzie więcej, automatycznie pojawi się paginacja.

**Q: Jak zmienić kolejność artykułów?**  
A: Artykuły są sortowane po dacie (najnowsze na górze). Zmień pole `date` w JSON.

**Q: Czy mogę użyć HTML w `contentMarkdown`?**  
A: Tak, ale zalecamy czysty Markdown. HTML będzie działał, ale może wymagać dodatkowych klas CSS.

**Q: Jak usunąć artykuł?**  
A: Usuń plik JSON z tego folderu. Artykuł zniknie automatycznie.

---

**Kontakt:** Jeśli masz pytania, zajrzyj do dokumentacji projektu lub skontaktuj się z developerem.
