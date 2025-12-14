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
      
      // Sprawdź wiek użytkownika dla filtrowania
      const wiekUzytkownika = typ === 'formularz' ? parseInt(dane.wiek) || 30 : null;
      
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
            
            // Filtr: odrzuć produkty dla dzieci gdy użytkownik jest dorosły
            if (wiekUzytkownika && wiekUzytkownika >= 18) {
              const searchLower = searchQuery.toLowerCase();
              const zakazaneSlowa = [
                'dla dzieci', 'dziecięcy', 'dziecięca', 'dziecka', 
                'maluch', 'niemowlę', 'zabawka', 'edukacyjny zestaw',
                'drewniany zestaw dla dzieci', 'plastikowy zestaw',
                '3+', '4+', '5+', '6+', '7+', '8+', 'lat+'
              ];
              
              const jestDlaDzieci = zakazaneSlowa.some(slowo => searchLower.includes(slowo));
              
              if (jestDlaDzieci) {
                console.log(`  ⛔ ODRZUCONO (produkt dla dzieci dla dorosłego): "${searchQuery}"`);
                continue;
              }
            }
            
            console.log(`  🔎 Szukam "${searchQuery}"...`);
            
            // Ceneo API nie wspiera lowestPrice, więc pobieramy więcej produktów i filtrujemy
            const allProducts = await searchProducts(searchQuery, {
              highestPrice: budzetDo,
              pageSize: 10, // Pobierz więcej produktów do filtrowania
            });
            
            // Filtruj produkty po minimalnej cenie (jeśli ustawiona)
            let filteredProducts = budzetOd > 0 
              ? allProducts.filter(p => p.LowestPrice >= budzetOd)
              : allProducts;
            
            // Dodatkowy filtr: usuń produkty dla dzieci gdy użytkownik jest dorosły
            if (wiekUzytkownika && wiekUzytkownika >= 18) {
              filteredProducts = filteredProducts.filter(product => {
                const nameLower = product.Name.toLowerCase();
                const zakazaneFrazy = [
                  'dla dzieci', 'dziecięcy', 'dziecięca', 'dzieciece',
                  'dla maluszka', 'dla niemowląt', 'zabawka',
                  ' 3+', ' 4+', ' 5+', ' 6+', ' 7+', ' 8+', 'lat+',
                  'edukacyjny dla dzieci', 'serwis dla dzieci'
                ];
                
                const jestDlaDzieci = zakazaneFrazy.some(fraza => nameLower.includes(fraza));
                
                if (jestDlaDzieci) {
                  console.log(`    ⛔ Pominięto produkt dla dzieci: "${product.Name}"`);
                  return false;
                }
                
                return true;
              });
            }
            
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
  // Analiza opisu pod kątem wieku
  const agePattern = /(\d+)\s*(lat|lata|rok|lat\s+)/i;
  const ageMatch = opis.match(agePattern);
  const wiek = ageMatch ? parseInt(ageMatch[1]) : null;
  
  let wiekWarning = '';
  if (wiek !== null) {
    if (wiek >= 18) {
      wiekWarning = `\n\n🚨 UWAGA - WIEK: Osoba ma ${wiek} lat, czyli jest DOROSŁA!
- ABSOLUTNIE ZAKAZANE: zabawki dla dzieci`;
    } else if (wiek < 13) {
      wiekWarning = `\n\n🚨 UWAGA - WIEK: Osoba ma ${wiek} lat, czyli jest DZIECKIEM!
- Proponuj zabawki, gry, książki, odpowiednie dla wieku ${wiek} lat`;
    } else {
      wiekWarning = `\n\n🚨 UWAGA - WIEK: Osoba ma ${wiek} lat, czyli jest NASTOLATKIEM!
- Proponuj produkty dla młodzieży`;
    }
  }
  
  return `Jesteś ekspertem w doborze prezentów. Użytkownik opisał osobę/sytuację:

"${opis}"

Budżet: ${budzetOd}-${budzetDo} PLN${wiekWarning}

ZADANIE:
Wygeneruj 10-12 RÓŻNORODNYCH pomysłów na prezenty pasujących do opisu.

KRYTYCZNIE WAŻNE:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo
2. Różnorodność - NIE powtarzaj podobnych kategorii
3. WSZYSTKIE produkty MUSZĄ mieścić się w budżecie ${budzetOd}-${budzetDo} PLN
4. Dopasuj propozycje do WIEKU, PŁCI i KONTEKSTU z opisu użytkownika
5. Jeśli opis wspomina wiek/płeć - BEZWZGLĘDNIE się do tego dostosuj
6. NIE proponuj prezentów dla dzieci gdy opis i wiek wskazuje na dorosłą osobę!

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
  
  // Określ grupę wiekową
  const wiek = parseInt(formData.wiek) || 30;
  let grupaWiekowa = '';
  if (wiek < 13) {
    grupaWiekowa = 'DZIECKO (0-12 lat)';
  } else if (wiek < 18) {
    grupaWiekowa = 'NASTOLATEK (13-17 lat)';
  } else if (wiek < 30) {
    grupaWiekowa = 'MŁODY DOROSŁY (18-29 lat)';
  } else if (wiek < 50) {
    grupaWiekowa = 'DOROSŁY (30-49 lat)';
  } else {
    grupaWiekowa = 'SENIOR (50+ lat)';
  }
  
  // Specjalne instrukcje dla konkretnych okazji
  let okazjaInstrukcje = '';
  const okazja = formData.okazja?.toLowerCase() || '';
  
  if (okazja.includes('chrzest')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: CHRZEST
- To uroczystość religijna - prezent powinien być pamiątkowy i symboliczny
- PRIORYTETOWE kategorie, przykłady: srebrne łyżeczki grawerowane, medaliki z Aniołkiem/Matką Boską, ramki na zdjęcia z grawerem, skarbonki srebrne, obrazki religijne w ramkach, albumy na zdjęcia z chrztu, pamiątkowe pudełka, srebrne kubeczki
- Dopuszczalne: praktyczne rzeczy dla niemowląt (pościel, kocyki, ubranka), książki religijne dla dzieci
- ZAKAZANE: zegarki, kosmetyki, biżuteria nie związana z okazją, elektronika, zabawki zwykłe
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('komunia') || okazja.includes('bierzmowanie')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- To uroczystość religijna
- PRIORYTETOWE: zegarki grawerowane, biżuteria z symbolami religijnymi, portfele skórzane, książki religijne, pamiątki religijne, zestawy piśmiennicze eleganckie
- Dopuszczalne: elektronika (jeśli w budżecie), gry planszowe rodzinne, rowery
- ZAKAZANE: alkohol, papierosy, prezenty infantylne
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('ślub') || okazja.includes('wesele')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- Prezent dla pary młodej
- PRIORYTETOWE: zestawy do domu (naczynia, garnki, pościel), dekoracje wnętrz, ramki na zdjęcia, kosz wiklinowy na prezenty, vouchery na wyjazd/kolację, sprzęt AGD
- Dopuszczalne: gotówka w eleganckim opakowaniu, albumy na zdjęcia ślubne
- Uniwersalne: zestaw kieliszków do wina, serwis kawowy
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('rocznica')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- Prezent romantyczny i osobisty
- PRIORYTETOWE: biżuteria, perfumy, zegarki, kolacja/wyjazd we dwoje, personalizowane prezenty z grawerem (ramki ze zdjęciem, albumy)
- Dopuszczalne: kwiaty premium, ekskluzywne alkohole, spa dla par
- Skupienie: elegancja i romantyzm
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('urodziny')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- Uniwersalna okazja - dopasuj do zainteresowań i wieku
- Pełna swoboda w doborze kategorii (elektronika, książki, sport, moda, hobby)
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('imieniny')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- Prezent może być bardziej symboliczny niż na urodziny
- PRIORYTETOWE: kwiaty, czekoladki premium, drobne upominki osobiste
- Dopuszczalne: książki, kosmetyki, dekoracje
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  } else if (okazja.includes('święta') || okazja.includes('boże narodzenie')) {
    okazjaInstrukcje = `\n\n🎯 OKAZJA: ${formData.okazja.toUpperCase()}
- Świąteczna atmosfera
- PRIORYTETOWE: ciepłe ubrania (swetry, szaliki), kosmetyki w zestawach, książki, zestawy herbat/kaw premium
- Dopuszczalne: elektronika, gry planszowe, dekoracje świąteczne
Podałem tylko przykłady, abyś wiedział o co chodzi, nie musisz sie ograniczać jedynie do tych rzeczy wymienionych w instrukcji.`;
  }
  
  return `Jesteś ekspertem w doborze prezentów. Użytkownik wypełnił formularz:

Okazja: ${formData.okazja}
Płeć odbiorcy: ${formData.plec}
Wiek: ${wiekInfo} → ${grupaWiekowa}
Budżet: ${formData.budzetOd} - ${formData.budzetDo} PLN

ZADANIE:
Wygeneruj 10-12 RÓŻNORODNYCH pomysłów na prezenty ${plecInfo} w wieku ${wiekInfo}.

🚨 ABSOLUTNIE KRYTYCZNE - WIEK I PŁEĆ:
- Odbiorca ma ${wiekInfo} (grupa: ${grupaWiekowa})
- Płeć: ${formData.plec} - ZAWSZE proponuj prezenty odpowiednie dla tej płci
${wiek >= 18 ? `- To DOROSŁA osoba - NIE PROPONUJ zabawek, zestawów dla dzieci, gier planszowych dla dzieci
- ZAKAZANE: serwisy do herbaty dla dzieci, zabawki drewniane, zabawki, klocki dla małych dzieci, pluszaki, kolorowanki
` : ''}
${wiek < 13 ? `- To DZIECKO - proponuj zabawki, gry, książki dla dzieci odpowiednie dla wieku ${wiekInfo}` : ''}
${wiek >= 13 && wiek < 18 ? `- To NASTOLATEK - proponuj gry, elektronikę, sport, modę młodzieżową itp.` : ''}
${formData.plec === 'kobieta' ? `- To KOBIETA - NIE proponuj męskich produktów (zegarki męskie, kosmetyki męskie, bransoletki męskie, wody toaletowe męskie)` : ''}
${formData.plec === 'mężczyzna' ? `- To MĘŻCZYZNA - NIE proponuj damskich produktów (perfumy damskie, kosmetyki damskie, biżuteria damska, torebki damskie)` : ''}
${okazjaInstrukcje}

KRYTYCZNIE WAŻNE - DOPASOWANIE DO FORMULARZA:
1. Każdy pomysł musi mieć KONKRETNĄ nazwę produktu do wyszukania w Ceneo
2. WSZYSTKIE produkty MUSZĄ odpowiadać OKAZJI: ${formData.okazja}
3. WSZYSTKIE produkty MUSZĄ być odpowiednie dla PŁCI: ${formData.plec}
4. WSZYSTKIE produkty MUSZĄ odpowiadać WIEKOWI: ${wiekInfo}
5. WSZYSTKIE produkty MUSZĄ mieścić się w budżecie ${formData.budzetOd}-${formData.budzetDo} PLN
6. Różnorodność - NIE powtarzaj podobnych kategorii

Przykłady ZŁYCH propozycji (ABSOLUTNIE ZAKAZANE):
- Zegarek męski dla kobiety / Perfumy damskie dla mężczyzny
- Klocki LEGO dla dzieci 5+ gdy odbiorca ma ${formData.wiek || 30} lat
- Zabawki/lalki gdy to dorosła osoba
- Produkty poza budżetem ${formData.budzetOd}-${formData.budzetDo} PLN
- Kosmetyki/zegarki na chrzest (tylko pamiątki religijne!)

Format odpowiedzi JSON:
{
  "prezenty": [
    {
      "searchQuery": "konkretna fraza do wyszukania w Ceneo (np. 'srebrna łyżeczka chrzest grawer', 'medalik aniołek srebro', 'ramka na zdjęcie chrzest')",
      "description": "Dlaczego to pasuje do odbiorcy i okazji (uwzględnij WIEK, PŁEĆ, OKAZJĘ)",
      "why": "Uzasadnienie wyboru względem formularza"
    }
  ]
}

Zwróć 10-12 RÓŻNYCH pomysłów z RÓŻNYCH kategorii produktów ZAWSZE DOPASOWANYCH DO FORMULARZA.`;
}
