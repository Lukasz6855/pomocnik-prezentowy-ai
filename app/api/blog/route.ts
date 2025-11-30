// API endpoint do generowania artykułów blogowych przez AI
import { NextRequest, NextResponse } from 'next/server';
import openai, { MODEL_NAME } from '@/lib/llmProvider';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Handler dla żądań POST
export async function POST(request: NextRequest) {
  try {
    // Pobieranie tematu artykułu z body żądania
    const body = await request.json();
    const { temat } = body;
    
    // Walidacja danych wejściowych
    if (!temat || typeof temat !== 'string') {
      return NextResponse.json(
        { error: 'Brak tematu artykułu' },
        { status: 400 }
      );
    }
    
    // Przygotowanie promptu dla AI
    const prompt = `Jesteś ekspertem w tworzeniu treści blogowych SEO. Napisz kompletny artykuł na temat:

"${temat}"

Artykuł powinien być:
- Zoptymalizowany pod SEO
- Napisany w języku polskim
- Długość: 800-1200 słów
- Zawierać wartościowe informacje
- Być przyjazny dla użytkownika

Zwróć artykuł jako obiekt JSON w formacie:
{
  "tytul": "SEO-friendly tytuł artykułu (max 60 znaków)",
  "lead": "Wstęp/lead artykułu (2-3 zdania zachęcające do czytania)",
  "naglowki": ["Nagłówek 1", "Nagłówek 2", "Nagłówek 3"],
  "tresc": "Pełna treść artykułu w formacie Markdown z nagłówkami H2, H3, listami, pogrubieniami itp."
}

Zwróć tylko obiekt JSON, bez dodatkowego tekstu.`;
    
    // Wywołanie API OpenAI
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME, // Model z zmiennej środowiskowej
      messages: [
        {
          role: 'system',
          content: 'Jesteś ekspertem SEO i copywriterem. Tworzysz wartościowe artykuły blogowe.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7, // Średnia temperatura dla kreatywności + spójności
      response_format: { type: "json_object" } // Wymuszenie odpowiedzi JSON
    });
    
    // Parsowanie odpowiedzi AI
    const odpowiedzAI = completion.choices[0].message.content;
    let artykul;
    
    try {
      artykul = JSON.parse(odpowiedzAI || '{}');
    } catch (error) {
      console.error('Błąd parsowania odpowiedzi AI:', error);
      return NextResponse.json(
        { error: 'Błąd przetwarzania odpowiedzi AI' },
        { status: 500 }
      );
    }
    
    // Tworzenie nazwy pliku (slug z tytułu)
    const slug = artykul.tytul
      .toLowerCase()
      .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
      .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
      .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const dataPublikacji = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nazwaPliku = `${dataPublikacji}-${slug}.md`;
    
    // Tworzenie pełnej treści Markdown
    const trescMarkdown = `---
title: "${artykul.tytul}"
date: "${dataPublikacji}"
lead: "${artykul.lead}"
---

# ${artykul.tytul}

${artykul.lead}

${artykul.tresc}

---

*Artykuł wygenerowany przez AI dla celów SEO*
`;
    
    // Zapis pliku do katalogu /content/blog
    try {
      // Ścieżka do katalogu content/blog
      const sciezkaBlog = join(process.cwd(), 'content', 'blog');
      
      // Utworzenie katalogu jeśli nie istnieje
      await mkdir(sciezkaBlog, { recursive: true });
      
      // Zapis pliku
      const sciezkaPliku = join(sciezkaBlog, nazwaPliku);
      await writeFile(sciezkaPliku, trescMarkdown, 'utf-8');
      
      // Zwrócenie sukcesu
      return NextResponse.json({
        success: true,
        artykul: {
          tytul: artykul.tytul,
          lead: artykul.lead,
          naglowki: artykul.naglowki,
          slug: slug,
          plik: nazwaPliku,
          sciezka: `/content/blog/${nazwaPliku}`
        },
        podglad: trescMarkdown
      });
      
    } catch (fileError) {
      console.error('Błąd zapisu pliku:', fileError);
      
      // Zwrócenie artykułu bez zapisu (jako fallback)
      return NextResponse.json({
        success: true,
        zapisPliku: false,
        artykul: {
          tytul: artykul.tytul,
          lead: artykul.lead,
          naglowki: artykul.naglowki
        },
        podglad: trescMarkdown,
        error: 'Nie udało się zapisać pliku, ale artykuł został wygenerowany'
      });
    }
    
  } catch (error) {
    // Obsługa błędów
    console.error('Błąd w API /api/blog:', error);
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas generowania artykułu',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      },
      { status: 500 }
    );
  }
}
