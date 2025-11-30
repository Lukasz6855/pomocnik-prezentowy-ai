// API endpoint do generowania propozycji prezentów
// NOWA WERSJA z integracją Allegro API
import { NextRequest, NextResponse } from 'next/server';
import openai, { MODEL_NAME } from '@/lib/llmProvider';
import allegroClient from '@/lib/allegroClient';
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
    let zainteresowania: string[] = [];
    
    if (typ === 'formularz') {
      const formData = dane;
      zainteresowania = formData.zainteresowania || [];
      budzetOd = parseFloat(formData.budzetOd) || 0;
      budzetDo = parseFloat(formData.budzetDo) || 10000;
      
      // Budowanie frazy wyszukiwania z zainteresowań
      searchPhrase = zainteresowania.join(' ');
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
    
    // KROK 2: Wyszukiwanie w Allegro API (5 ofert)
    let allegroOffers: any[] = [];
    
    if (allegroClient.isConfigured() && searchPhrase) {
      try {
        console.log('🛒 Wyszukiwanie w Allegro...');
        const result = await allegroClient.searchOffers({
          phrase: searchPhrase,
          priceFrom: budzetOd,
          priceTo: budzetDo,
          limit: 10, // Pobieramy 10, AI wybierze 5 najlepszych
          sort: '-popularity',
        });
        
        // Łączenie promoted + regular
        allegroOffers = [
          ...result.items.promoted,
          ...result.items.regular,
        ].slice(0, 10); // Max 10 ofert
        
        console.log(`✅ Znaleziono ${allegroOffers.length} ofert w Allegro`);
      } catch (error: any) {
        console.error('❌ Błąd Allegro API:', error.message);
        // Kontynuujemy bez Allegro
      }
    }
    
    // KROK 3: Prompt dla AI - wybór z ofert Allegro + propozycje z innych sklepów
    let prompt = '';
    
    if (typ === 'losowy') {
      prompt = buildPromptForRandom(allegroOffers, budzetOd, budzetDo);
    } else if (typ === 'opis') {
      prompt = buildPromptForDescription(dane.opis, allegroOffers, budzetOd, budzetDo);
    } else if (typ === 'formularz') {
      prompt = buildPromptForForm(dane, allegroOffers);
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
      const aiResults = parsowanyJSON.prezenty || parsowanyJSON.gifts || [];
      
      // KROK 6: Konwersja wyników AI na format Prezent
      for (const item of aiResults) {
        if (item.source === 'allegro' && item.allegroId) {
          // Oferta z Allegro - znajdź pełne dane
          const allegroOffer = allegroOffers.find(o => o.id === item.allegroId);
          if (allegroOffer) {
            const converted = allegroClient.convertToAppFormat(allegroOffer);
            prezenty.push({
              ...converted,
              description: item.description || converted.description,
              why: item.why || 'Świetny wybór z Allegro!',
              // Użyj proxy dla miniaturki
              imageUrl: converted.imageUrl 
                ? `/api/proxy-image?url=${encodeURIComponent(converted.imageUrl)}`
                : undefined,
              realImageUrl: converted.imageUrl || undefined,
            });
          }
        } else if (item.source === 'other' && item.shopKey && item.productCategory) {
          // Oferta z innego sklepu (bez API)
          const proposal = createOtherShopProposal(
            item.shopKey,
            item.productCategory,
            item.description,
            item.why,
            item.price_estimate
          );
          if (proposal) {
            prezenty.push(proposal);
          }
        }
      }
      
      console.log(`✅ Wygenerowano ${prezenty.length} propozycji`);
      
    } catch (parseError: any) {
      console.error('❌ Błąd parsowania JSON:', parseError);
      throw new Error('AI zwróciło nieprawidłowy format odpowiedzi');
    }
    
    // KROK 7: Fallback - jeśli AI nic nie zwróciło
    if (prezenty.length === 0) {
      console.warn('⚠️ AI nie zwróciło propozycji, używam fallback');
      
      // Użyj pierwszych 5 ofert z Allegro bezpośrednio
      prezenty = allegroOffers.slice(0, 5).map(offer => {
        const converted = allegroClient.convertToAppFormat(offer);
        return {
          ...converted,
          why: 'Popularna oferta z Allegro pasująca do Twoich kryteriów.',
          imageUrl: converted.imageUrl 
            ? `/api/proxy-image?url=${encodeURIComponent(converted.imageUrl)}`
            : undefined,
          realImageUrl: converted.imageUrl || undefined,
        };
      });
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

function buildPromptForRandom(allegroOffers: any[], budzetOd: number, budzetDo: number): string {
  const offersJson = JSON.stringify(allegroOffers.slice(0, 10).map(o => ({
    id: o.id,
    name: o.name,
    price: o.sellingMode.price.amount,
    currency: o.sellingMode.price.currency,
  })), null, 2);
  
  return `Jesteś ekspertem e-commerce. Użytkownik szuka losowych, kreatywnych prezentów.

DOSTĘPNE OFERTY Z ALLEGRO (wybierz 5 najlepszych):
${offersJson}

PROPOZYCJE Z INNYCH SKLEPÓW (wygeneruj 5 kategorii produktów):
Sklepy: Vistula, Reserved, Empik, Smyk, Douglas, Pepco, Morele, Media Expert

KRYTYCZNIE WAŻNE:
1. NIE WYMYŚLAJ konkretnych modeli produktów
2. Dla Allegro: wybierz 5 najlepszych ofert z listy powyżej (użyj realnych ID)
3. Dla innych sklepów: podaj TYLKO kategorię produktu (np. "koszula slim fit"), bez wymyślonych modeli
4. Budżet: ${budzetOd}-${budzetDo} PLN

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "source": "allegro",
      "allegroId": "ID z listy powyżej",
      "description": "Dlaczego to dobry prezent (2-3 zdania)",
      "why": "Dla kogo i w jakiej sytuacji (2 zdania)"
    },
    {
      "source": "other",
      "shopKey": "vistula|reserved|empik|smyk|douglas|pepco|morele|mediaexpert",
      "productCategory": "kategoria produktu bez konkretnego modelu",
      "description": "Opis produktu (2-3 zdania)",
      "why": "Dla kogo i kiedy (2 zdania)",
      "price_estimate": "100-150 PLN"
    }
  ]
}

Zwróć 10 propozycji: 5 z Allegro + 5 z innych sklepów.`;
}

function buildPromptForDescription(opis: string, allegroOffers: any[], budzetOd: number, budzetDo: number): string {
  const offersJson = JSON.stringify(allegroOffers.slice(0, 10).map(o => ({
    id: o.id,
    name: o.name,
    price: o.sellingMode.price.amount,
    currency: o.sellingMode.price.currency,
  })), null, 2);
  
  return `Jesteś ekspertem e-commerce. Użytkownik opisał osobę/sytuację:

"${opis}"

DOSTĘPNE OFERTY Z ALLEGRO (wybierz 5 najlepszych pasujących do opisu):
${offersJson}

PROPOZYCJE Z INNYCH SKLEPÓW (wygeneruj 5 kategorii produktów):
Sklepy: Vistula, Reserved, Empik, Smyk, Douglas, Pepco, Morele, Media Expert

KRYTYCZNIE WAŻNE:
1. NIE WYMYŚLAJ konkretnych modeli produktów
2. Dla Allegro: wybierz 5 najlepszych ofert z listy powyżej (użyj realnych ID)
3. Dla innych sklepów: podaj TYLKO kategorię produktu (np. "perfumy męskie"), bez wymyślonych nazw
4. Budżet: ${budzetOd}-${budzetDo} PLN
5. Dopasuj propozycje do opisu użytkownika

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "source": "allegro",
      "allegroId": "ID z listy powyżej",
      "description": "Dlaczego pasuje do opisanej osoby (2-3 zdania)",
      "why": "Uzasadnienie wyboru (2 zdania)"
    },
    {
      "source": "other",
      "shopKey": "vistula|reserved|empik|smyk|douglas|pepco|morele|mediaexpert",
      "productCategory": "kategoria produktu",
      "description": "Opis (2-3 zdania)",
      "why": "Dlaczego pasuje do opisu (2 zdania)",
      "price_estimate": "100-150 PLN"
    }
  ]
}

Zwróć 10 propozycji: 5 z Allegro + 5 z innych sklepów.`;
}

function buildPromptForForm(formData: any, allegroOffers: any[]): string {
  const offersJson = JSON.stringify(allegroOffers.slice(0, 10).map(o => ({
    id: o.id,
    name: o.name,
    price: o.sellingMode.price.amount,
    currency: o.sellingMode.price.currency,
  })), null, 2);
  
  return `Jesteś ekspertem e-commerce. Użytkownik wypełnił formularz:

Okazja: ${formData.okazja}
Płeć: ${formData.plec}
Relacja: ${formData.relacja}
Wiek: ${formData.wiek}
Zainteresowania: ${formData.zainteresowania?.join(', ')}
Styl: ${formData.stylPrezentu}
Forma: ${formData.formaPrezentu?.join(', ')}
Budżet: ${formData.budzetOd} - ${formData.budzetDo} PLN

DOSTĘPNE OFERTY Z ALLEGRO (wybierz 5 najlepszych pasujących do kryteriów):
${offersJson}

PROPOZYCJE Z INNYCH SKLEPÓW (wygeneruj 5 kategorii produktów):
Sklepy: Vistula, Reserved, Empik, Smyk, Douglas, Pepco, Morele, Media Expert

KRYTYCZNIE WAŻNE:
1. NIE WYMYŚLAJ konkretnych modeli produktów
2. Dla Allegro: wybierz 5 najlepszych ofert z listy powyżej (użyj realnych ID)
3. Dla innych sklepów: podaj TYLKO kategorię produktu, bez wymyślonych nazw
4. Dopasuj do budżetu ${formData.budzetOd}-${formData.budzetDo} PLN
5. Uwzględnij zainteresowania i okazję

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "source": "allegro",
      "allegroId": "ID z listy powyżej",
      "description": "Dlaczego pasuje do kryteriów (2-3 zdania)",
      "why": "Uzasadnienie (2 zdania)"
    },
    {
      "source": "other",
      "shopKey": "vistula|reserved|empik|smyk|douglas|pepco|morele|mediaexpert",
      "productCategory": "kategoria produktu",
      "description": "Opis (2-3 zdania)",
      "why": "Dlaczego pasuje (2 zdania)",
      "price_estimate": "cena w budżecie"
    }
  ]
}

Zwróć 10 propozycji: 5 z Allegro + 5 z innych sklepów.`;
}
