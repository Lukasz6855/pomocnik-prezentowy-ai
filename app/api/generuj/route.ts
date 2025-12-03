// API endpoint do generowania propozycji prezentów
// Integracja z Ceneo API + linki do innych sklepów
import { NextRequest, NextResponse } from 'next/server';
import openai, { MODEL_NAME } from '@/lib/llmProvider';
import { searchProducts } from '@/lib/ceneoClient';
import type { CeneoProduct } from '@/lib/ceneoClient';
import { generateShopSearchLink, findBestShopForCategory, createOtherShopProposal } from '@/lib/otherShopsHelper';
import { Prezent } from '@/lib/types';

// Handler dla żądań POST
export async function POST(request: NextRequest) {
  try {
    // Pobieranie danych z body żądania
    const body = await request.json();
    const { typ, dane } = body; // typ: "formularz" | "opis" | "losowy"
    
    console.log(`🎁 Generowanie prezentów: typ=${typ}`);
    
    // KROK 1: Określenie parametrów wyszukiwania
    let searchPhrase = '';
    let budzetOd = 0;
    let budzetDo = 10000;
    
    if (typ === 'formularz') {
      const formData = dane;
      budzetOd = parseFloat(formData.budzetOd) || 0;
      budzetDo = parseFloat(formData.budzetDo) || 10000;
      
      // Użyj ogólnej frazy bazującej na okazji i płci
      searchPhrase = `prezent ${formData.okazja} ${formData.plec}`;
    } else if (typ === 'opis') {
      searchPhrase = dane.opis || '';
      // Ekstrakcja budżetu z opisu (jeśli jest)
      const budgetMatch = dane.opis.match(/(\d+)\s*-\s*(\d+)\s*zł/i);
      if (budgetMatch) {
        budzetOd = parseInt(budgetMatch[1]);
        budzetDo = parseInt(budgetMatch[2]);
      }
    } else if (typ === 'losowy') {
      searchPhrase = 'prezent';
      budzetOd = 50;
      budzetDo = 500;
    }
    
    console.log(`🔍 Parametry: phrase="${searchPhrase}", budżet=${budzetOd}-${budzetDo}`);
    
    // KROK 2: Prompt dla AI - generowanie pomysłów na prezenty (BEZ Ceneo)
    let prompt = '';
    
    if (typ === 'losowy') {
      prompt = buildPromptForRandom(budzetOd, budzetDo);
    } else if (typ === 'opis') {
      prompt = buildPromptForDescription(dane.opis, budzetOd, budzetDo);
    } else if (typ === 'formularz') {
      prompt = buildPromptForForm(dane);
    }
    
    console.log('🤖 Wywołanie AI...');
    
    // KROK 4: Wywołanie OpenAI
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem prezentowym AI. Zawsze odpowiadasz w formacie JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    // KROK 5: Parsowanie odpowiedzi AI
    const odpowiedzAI = completion.choices[0].message.content;
    let prezenty: Prezent[] = [];
    
    try {
      const parsowanyJSON = JSON.parse(odpowiedzAI || '{}');
      const aiIdeas = parsowanyJSON.prezenty || parsowanyJSON.gifts || [];
      
      console.log(`🤖 AI wygenerowało ${aiIdeas.length} pomysłów`);
      
      // KROK 6: Dla każdego pomysłu AI szukamy w Ceneo
      if (process.env.CENEO_API_KEY) {
        console.log('🛒 Wyszukiwanie produktów w Ceneo dla pomysłów AI...');
        
        for (const idea of aiIdeas) {
          try {
            // Wyszukaj w Ceneo używając nazwy produktu z AI
            const searchQuery = idea.searchQuery || idea.title || idea.productName;
            
            if (!searchQuery) {
              console.warn('⚠️ Brak searchQuery dla pomysłu:', idea);
              continue;
            }
            
            console.log(`  🔎 Szukam "${searchQuery}"...`);
            
            const products = await searchProducts(searchQuery, {
              highestPrice: budzetDo,
              pageSize: 1, // Weź tylko najlepszy produkt
            });
            
            if (products.length > 0) {
              const product = products[0];
              const affiliateUrl = `${product.Url}#pid=${process.env.CENEO_PARTNER_ID}`;
              
              prezenty.push({
                title: product.Name,
                description: idea.description || product.ManufacturerName || product.Name,
                why: idea.why || 'Świetny wybór z Ceneo!',
                price_estimate: `${product.LowestPrice} PLN`,
                imageUrl: product.ThumbnailUrl,
                source: 'ceneo',
                ceneoId: product.Id.toString(),
                shop_links: [
                  {
                    shop: 'Ceneo',
                    url: affiliateUrl,
                    isConcreteOffer: true,
                  },
                ],
              });
              
              console.log(`    ✓ Znaleziono: ${product.Name} (${product.LowestPrice} PLN)`);
            } else {
              console.log(`    ✗ Brak produktów dla "${searchQuery}"`);
            }
          } catch (error: any) {
            console.error(`    ✗ Błąd wyszukiwania:`, error.message);
          }
        }
      }
      
      console.log(`✅ Wygenerowano ${prezenty.length} propozycji z Ceneo`);
      
    } catch (parseError: any) {
      console.error('❌ Błąd parsowania JSON:', parseError);
      throw new Error('AI zwróciło nieprawidłowy format odpowiedzi');
    }
    
    // KROK 7: Sprawdź czy mamy wyniki
    if (prezenty.length === 0) {
      console.warn('⚠️ Brak produktów z Ceneo dla pomysłów AI');
      throw new Error('Nie znaleziono produktów pasujących do kryteriów. Spróbuj zmienić parametry wyszukiwania lub zwiększyć budżet.');
    }
    
    // Limit do 10 najlepszych (zmieniono z 5 na 10)
    if (prezenty.length > 10) {
      prezenty = prezenty.slice(0, 10);
      console.log(`📦 Ograniczono do 10 najlepszych propozycji`);
    }
    
    // KROK 8: Zwrócenie wyniku
    return NextResponse.json({
      success: true,
      count: prezenty.length,
      prezenty,
    });
    
  } catch (error: any) {
    console.error('❌ Błąd generowania:', error);
    return NextResponse.json(
      { 
        error: 'Błąd generowania propozycji',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// ========== FUNKCJE POMOCNICZE ==========

function buildPromptForRandom(budzetOd: number, budzetDo: number): string {
  return `Jesteś ekspertem w doborze prezentów. Wygeneruj 8-10 RÓŻNORODNYCH pomysłów na prezenty dla losowej osoby.

Budżet: ${budzetOd}-${budzetDo} PLN

KRYTYCZNIE WAŻNE:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo (np. "słuchawki bezprzewodowe", "smartwatch", "kawa ziarnista")
2. Różnorodność - NIE powtarzaj podobnych kategorii
3. Dopasuj do budżetu ${budzetOd}-${budzetDo} PLN
4. Mix kategorii: elektronika, książki, kosmetyki, sport, dom, kulinaria itp.

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'powerbank 20000mah')",
      "description": "Dlaczego to dobry prezent (2-3 zdania)",
      "why": "Dla kogo i w jakiej sytuacji (1-2 zdania)"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów.`;
}

function buildPromptForDescription(opis: string, budzetOd: number, budzetDo: number): string {
  return `Jesteś ekspertem w doborze prezentów. Użytkownik opisał osobę/sytuację:

"${opis}"

Budżet: ${budzetOd}-${budzetDo} PLN

ZADANIE:
Wygeneruj 10-12 RÓŻNORODNYCH pomysłów na prezenty pasujących do opisu.

KRYTYCZNIE WAŻNE:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo (np. "książka fantasy", "zestaw kosmetyków", "plecak turystyczny")
2. Różnorodność - NIE powtarzaj podobnych kategorii
3. Dopasuj do budżetu ${budzetOd}-${budzetDo} PLN
4. Dopasuj propozycje do opisu użytkownika

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'perfumy męskie hugo boss')",
      "description": "Dlaczego pasuje do opisanej osoby (2-3 zdania)",
      "why": "Uzasadnienie wyboru (1-2 zdania)"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów.`;
}

function buildPromptForForm(formData: any): string {
  return `Jesteś ekspertem w doborze prezentów. Użytkownik wypełnił formularz:

Okazja: ${formData.okazja}
Płeć: ${formData.plec}
Wiek: ${formData.wiek}
Budżet: ${formData.budzetOd} - ${formData.budzetDo} PLN

ZADANIE:
Wygeneruj 10-12 RÓŻNORODNYCH pomysłów na prezenty. Każdy pomysł powinien być z INNEJ kategorii.

KRYTYCZNIE WAŻNE:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo (np. "słuchawki bezprzewodowe", "smartwatch", "zestaw pędzli do makijażu")
2. Różnorodność - NIE powtarzaj podobnych kategorii (np. jeśli jest "smartwatch", to nie dodawaj "opaska fitness")
3. Dopasuj do budżetu ${formData.budzetOd}-${formData.budzetDo} PLN
4. Uwzględnij kontekst: okazja, płeć, wiek

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'słuchawki bluetooth JBL')",
      "description": "Dlaczego to pasuje do odbiorcy (2-3 zdania, uwzględnij okazję)",
      "why": "Uzasadnienie wyboru (1-2 zdania)"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów.`;
}
