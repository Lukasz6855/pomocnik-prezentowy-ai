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
      // Użyj budżetu z dane jeśli został przekazany z formularza
      if (dane.budzetOd !== undefined) {
        budzetOd = parseFloat(dane.budzetOd) || 0;
      }
      if (dane.budzetDo !== undefined) {
        budzetDo = parseFloat(dane.budzetDo) || 10000;
      }
      // Ekstrakcja budżetu z opisu (jeśli nie ma z formularza)
      if (budzetOd === 0 && budzetDo === 10000) {
        const budgetMatch = dane.opis.match(/(\d+)\s*-\s*(\d+)\s*zł/i);
        if (budgetMatch) {
          budzetOd = parseInt(budgetMatch[1]);
          budzetDo = parseInt(budgetMatch[2]);
        }
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
            
            // Ceneo API nie wspiera lowestPrice, więc pobieramy więcej produktów i filtrujemy
            const allProducts = await searchProducts(searchQuery, {
              highestPrice: budzetDo,
              pageSize: 10, // Pobierz więcej produktów do filtrowania
            });
            
            // Filtruj produkty po minimalnej cenie (jeśli ustawiona)
            const filteredProducts = budzetOd > 0 
              ? allProducts.filter(p => p.LowestPrice >= budzetOd)
              : allProducts;
            
            if (filteredProducts.length > 0) {
              const product = filteredProducts[0];
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
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo
2. Różnorodność - NIE powtarzaj podobnych kategorii
3. WSZYSTKIE produkty MUSZĄ mieścić się w budżecie ${budzetOd}-${budzetDo} PLN
4. Dopasuj propozycje do WIEKU, PŁCI i KONTEKSTU z opisu użytkownika
5. Jeśli opis wspomina wiek/płeć - BEZWZGLĘDNIE się do tego dostosuj
6. NIE proponuj prezentów dla dzieci gdy opis wskazuje na dorosłą osobę!

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'perfumy męskie hugo boss')",
      "description": "Dlaczego pasuje do opisanej osoby (uwzględnij wiek, płeć, kontekst)",
      "why": "Uzasadnienie wyboru"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów.`;
}

function buildPromptForForm(formData: any): string {
  const wiekInfo = formData.wiek ? `${formData.wiek} lat` : 'dorosła osoba';
  const plecInfo = formData.plec === 'kobieta' ? 'dla kobiety' : formData.plec === 'mężczyzna' ? 'dla mężczyzny' : 'dla osoby';
  
  return `Jesteś ekspertem w doborze prezentów. Użytkownik wypełnił formularz:

Okazja: ${formData.okazja}
Płeć odbiorcy: ${formData.plec}
Wiek: ${wiekInfo}
Budżet: ${formData.budzetOd} - ${formData.budzetDo} PLN

ZADANIE:
Wygeneruj 10-12 RÓŻNORODNYCH pomysłów na prezenty ${plecInfo} w wieku ${wiekInfo}.

KRYTYCZNIE WAŻNE:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo
2. Różnorodność - NIE powtarzaj podobnych kategorii
3. WSZYSTKIE produkty MUSZĄ mieścić się w budżecie ${formData.budzetOd}-${formData.budzetDo} PLN
4. Dopasuj do WIEKU (${wiekInfo}) i PŁCI (${formData.plec})
5. NIE proponuj prezentów dla dzieci gdy odbiorca to dorosły!
6. Uwzględnij okazję: ${formData.okazja}

Przykłady ZŁYCH propozycji (NIE rób tego):
- Klocki LEGO dla dzieci 5+ gdy odbiorca ma ${formData.wiek || 30} lat
- Lalki/zabawki gdy to dorosła osoba
- Produkty poza budżetem ${formData.budzetOd}-${formData.budzetDo} PLN

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'perfumy damskie', 'smartwatch męski', 'książka thriller')",
      "description": "Dlaczego to pasuje do odbiorcy (uwzględnij wiek, płeć, okazję)",
      "why": "Uzasadnienie wyboru"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów.`;
}
