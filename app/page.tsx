// Główna strona aplikacji - strona główna z formularzem i wyszukiwarką
'use client';

import { useState, useEffect } from 'react';
import GiftCard from '@/components/GiftCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Section from '@/components/Section';
import HeroSection from '@/components/HeroSection';
import { Prezent, DaneFormularza } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { websiteSchema, organizationSchema } from '@/lib/schemaOrg';

export default function StronaGlowna() {
  // Stan komponentu
  const [ladowanie, setLadowanie] = useState(false); // Czy trwa ładowanie
  const [prezenty, setPrezenty] = useState<Prezent[]>([]); // Lista wygenerowanych prezentów
  const [komunikatBledu, setKomunikatBledu] = useState<string | null>(null); // Komunikat błędu
  
  // Stan formularza (UPROSZCZONY - tylko: Okazja, Płeć, Wiek, Budżet)
  const [okazja, setOkazja] = useState('urodziny');
  const [okazjaInna, setOkazjaInna] = useState('');
  const [plec, setPlec] = useState('kobieta');
  const [wiek, setWiek] = useState('');
  const [budzetOd, setBudzetOd] = useState('');
  const [budzetDo, setBudzetDo] = useState('');
  
  // Stan opisu tekstowego (teraz zawsze widoczny obok formularza)
  const [opisTekstowy, setOpisTekstowy] = useState('');
  
  // Przywracanie wyników z sessionStorage po powrocie z innej karty (mobile fix)
  useEffect(() => {
    const savedResults = sessionStorage.getItem('searchResults');
    const savedFormData = sessionStorage.getItem('searchFormData');
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setPrezenty(parsedResults);
        
        // Przywróć również stan formularza
        if (savedFormData) {
          const formData = JSON.parse(savedFormData);
          setOkazja(formData.okazja || 'urodziny');
          setOkazjaInna(formData.okazjaInna || '');
          setPlec(formData.plec || 'kobieta');
          setWiek(formData.wiek || '');
          setBudzetOd(formData.budzetOd || '');
          setBudzetDo(formData.budzetDo || '');
          setOpisTekstowy(formData.opisTekstowy || '');
        }
      } catch (e) {
        console.error('Błąd przy odczytywaniu zapisanych wyników:', e);
      }
    }
  }, []);
  
  // Funkcja wysyłająca zapytanie do API (UPROSZCZONA - tylko formularz + opis)
  const wyslijZapytanie = async (dane: any) => {
    setLadowanie(true); // Włączenie loadera
    setKomunikatBledu(null); // Wyczyszczenie błędów
    setPrezenty([]); // Wyczyszczenie poprzednich wyników
    sessionStorage.removeItem('searchResults'); // Wyczyść poprzednie wyniki przy nowym wyszukiwaniu
    
    try {
      // Wysłanie żądania POST do API
      const odpowiedz = await fetch('/api/generuj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dane),
      });
      
      // Sprawdzenie statusu odpowiedzi
      if (!odpowiedz.ok) {
        const errorData = await odpowiedz.json().catch(() => ({}));
        throw new Error(errorData.error || 'Błąd podczas generowania propozycji');
      }
      
      // Parsowanie odpowiedzi JSON
      const wynik = await odpowiedz.json();
      
      // Ustawienie prezentów w stanie
      if (wynik.success && wynik.prezenty) {
        setPrezenty(wynik.prezenty);
        
        // Zapisz wyniki w sessionStorage (dla mobile - zachowanie przy powrocie z innej karty)
        sessionStorage.setItem('searchResults', JSON.stringify(wynik.prezenty));
        
        // Przewinięcie do wyników
        setTimeout(() => {
          document.getElementById('wyniki')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      } else {
        setKomunikatBledu('Nie udało się wygenerować propozycji prezentów.');
      }
      
    } catch (error) {
      console.error('Błąd:', error);
      setKomunikatBledu('Wystąpił błąd podczas łączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setLadowanie(false); // Wyłączenie loadera
    }
  };
  
  // Obsługa wysłania formularza (UPROSZCZONY - bez Relacji, Zainteresowań, Stylu, Formy)
  const obsluzWyslanieFomularza = (e: React.FormEvent) => {
    e.preventDefault(); // Zapobieganie domyślnej akcji formularza
    
    // Walidacja podstawowa
    if (!budzetDo) {
      setKomunikatBledu('Proszę podać maksymalny budżet');
      return;
    }
    
    // Przygotowanie danych - połączenie formularza + opis tekstowy
    const daneFormularza: DaneFormularza = {
      okazja: okazja === 'inne' ? okazjaInna : okazja,
      plec: plec,
      wiek: wiek,
      budzetOd: budzetOd,
      budzetDo: budzetDo
    };
    
    // Jeśli jest opis tekstowy, użyj trybu 'opis' + przekaż budżet z formularza
    if (opisTekstowy.trim()) {
      wyslijZapytanie({
        typ: 'opis',
        dane: {
          opis: `${opisTekstowy}\n\nDodatkowe info z formularza: Okazja: ${daneFormularza.okazja}, Płeć: ${plec}, Wiek: ${wiek || 'nieokreślony'}, Budżet: ${budzetOd || '0'}-${budzetDo} PLN`,
          budzetOd: budzetOd,
          budzetDo: budzetDo
        }
      });
    } else {
      wyslijZapytanie({
        typ: 'formularz',
        dane: daneFormularza
      });
    }
  };
  
  // Zarządzanie ulubionymi (localStorage)
  const dodajDoUlubionych = (prezent: Prezent) => {
    // Pobranie aktualnych ulubionych z localStorage
    const ulubione = JSON.parse(localStorage.getItem('ulubione') || '[]');
    
    // Sprawdzenie czy prezent już nie istnieje
    const czyIstnieje = ulubione.some((u: Prezent) => u.title === prezent.title);
    
    if (!czyIstnieje) {
      // Dodanie prezentu do ulubionych
      ulubione.push(prezent);
      localStorage.setItem('ulubione', JSON.stringify(ulubione));
    }
  };
  
  const usunZUlubionych = (prezent: Prezent) => {
    // Pobranie aktualnych ulubionych z localStorage
    const ulubione = JSON.parse(localStorage.getItem('ulubione') || '[]');
    
    // Filtrowanie (usunięcie prezentu)
    const nowUlubione = ulubione.filter((u: Prezent) => u.title !== prezent.title);
    localStorage.setItem('ulubione', JSON.stringify(nowUlubione));
  };
  
  const czyJestUlubiony = (prezent: Prezent): boolean => {
    // Pobranie ulubionych z localStorage
    const ulubione = JSON.parse(localStorage.getItem('ulubione') || '[]');
    return ulubione.some((u: Prezent) => u.title === prezent.title);
  };
  
  const toggleUlubiony = (prezent: Prezent) => {
    if (czyJestUlubiony(prezent)) {
      usunZUlubionych(prezent);
    } else {
      dodajDoUlubionych(prezent);
    }
    // Wymuszenie re-render
    setPrezenty([...prezenty]);
  };
  
  return (
    <>
      {/* Schema.org JSON-LD dla SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Główna sekcja wyszukiwania */}
      <Section 
        id="formularz"
        tytul="Wyszukaj Prezent" 
        opis="Wypełnij podstawowe informacje i opcjonalnie dodaj szczegółowy opis - AI znajdzie idealne propozycje!"
        className="py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* NOWY LAYOUT: Formularz + Pole tekstowe obok siebie */}
          <form onSubmit={obsluzWyslanieFomularza} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEWA KOLUMNA: Formularz podstawowy */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-purple-100 space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                  📋 Podstawowe Informacje
                </h3>
                
                {/* Okazja */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🎉 Okazja *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['urodziny', 'imieniny', 'chrzest', 'ślub', 'rocznica ślubu', 'Mikołaj', 'pod choinkę', 'walentynkowy'].map(o => (
                      <label key={o} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="okazja"
                          value={o}
                          checked={okazja === o}
                          onChange={(e) => setOkazja(e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm group-hover:text-purple-600">{o.charAt(0).toUpperCase() + o.slice(1)}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="okazja"
                        value="inne"
                        checked={okazja === 'inne'}
                        onChange={(e) => setOkazja(e.target.value)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm">Inne</span>
                    </label>
                  </div>
                  {okazja === 'inne' && (
                    <input
                      type="text"
                      value={okazjaInna}
                      onChange={(e) => setOkazjaInna(e.target.value)}
                      placeholder="Wpisz okazję..."
                      className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  )}
                </div>
                
                {/* Płeć */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    👤 Płeć obdarowanej osoby *
                  </label>
                  <div className="flex gap-4">
                    {['kobieta', 'mężczyzna', 'para/małżeństwo'].map(p => (
                      <label key={p} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="plec"
                          value={p}
                          checked={plec === p}
                          onChange={(e) => setPlec(e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm group-hover:text-purple-600">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Wiek */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    🎂 Wiek lub rocznica
                  </label>
                  <input
                    type="text"
                    value={wiek}
                    onChange={(e) => setWiek(e.target.value)}
                    placeholder="np. 30 lat, 10 rocznica ślubu..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {/* Budżet */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    💰 Budżet (PLN) *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={budzetOd}
                      onChange={(e) => setBudzetOd(e.target.value)}
                      placeholder="Od"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <span className="text-gray-500 flex-shrink-0">-</span>
                    <input
                      type="number"
                      value={budzetDo}
                      onChange={(e) => setBudzetDo(e.target.value)}
                      placeholder="Do"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* PRAWA KOLUMNA: Pole tekstowe z opisem */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-purple-100 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                  ✍️ Szczegółowy Opis
                </h3>
                
                <div>
                  <textarea
                    value={opisTekstowy}
                    onChange={(e) => setOpisTekstowy(e.target.value)}
                    rows={12}
                    placeholder="Np. Szukam prezentu dla mojej mamy. Uwielbia gotować, czytać kryminały i pić dobrą kawę. Chciałbym coś praktycznego ale eleganckiego. Ma już masę książek więc raczej nie książka..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Informacja o opcjonalności */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-purple-700">💡 Wskazówka:</span> Po prostu opisz swoimi słowami jakiego prezentu szukasz i dla kogo. Im więcej szczegółów podasz w opisie tekstowym, tym bardziej dopasowane będą propozycje. Możesz opisać osobowość, hobby, to co osoba już ma, itp.
                  </p>
                </div>

              </div>
            </div>
            
            {/* Przycisk wysłania */}
            <div className="text-center">
              <button
                type="submit"
                disabled={ladowanie}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ladowanie ? '🔄 Szukam...' : '🔍 Wyszukaj Prezenty'}
              </button>
            </div>
          </form>
        </div>
      </Section>
      
      {/* Komunikat błędu */}
      {komunikatBledu && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {komunikatBledu}
          </div>
        </div>
      )}
      
      {/* Loader */}
      {ladowanie && (
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      )}
      
      {/* Wyniki */}
      {prezenty.length > 0 && !ladowanie && (
        <Section 
          id="wyniki"
          tytul={`🎁 Znalazłem ${prezenty.length} ${prezenty.length === 1 ? 'prezent' : prezenty.length < 5 ? 'prezenty' : 'prezentów'} dla Ciebie!`}
          opis="Wybierz najlepszy prezent i dodaj do ulubionych"
        >
          {/* Informacja o możliwości ponownego wyszukiwania */}
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  <span className="text-orange-600 font-bold">💡 Wskazówka:</span> Jeżeli propozycje nie są satysfakcjonujące, kliknij <span className="font-bold">"Wyszukaj Inne"</span> poniżej lub <span className="font-bold">dopisz więcej szczegółów w polu tekstowym</span> i wyszukaj ponownie.
                </p>
              </div>
            </div>
          </div>
          
          {/* GRID 2-KOLUMNOWY (responsive) */}
          <div className="grid md:grid-cols-2 gap-6">
            {prezenty.map((prezent, index) => (
              <GiftCard
                key={index}
                prezent={prezent}
                numer={index + 1}
                czyUlubiony={czyJestUlubiony(prezent)}
                onToggleUlubiony={() => toggleUlubiony(prezent)}
              />
            ))}
          </div>
          
          {/* Przycisk wyszukaj inne */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setPrezenty([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              ↻ Wyszukaj Inne
            </button>
          </div>
        </Section>
      )}
      
      {/* Sekcja "Jak to działa" */}
      <Section 
        tytul="Jak to działa?"
        tloCiemne
        id="jak-to-dziala"
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-bold text-lg mb-2">1. Wypełnij formularz</h3>
            <p className="text-gray-600">
              Podaj informacje o osobie lub opisz swoimi słowami
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="font-bold text-lg mb-2">2. AI analizuje</h3>
            <p className="text-gray-600">
              Sztuczna inteligencja dopasowuje najlepsze prezenty
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="font-bold text-lg mb-2">3. Wybierz prezent</h3>
            <p className="text-gray-600">
              Otrzymujesz listę idealnie dobranych propozycji
            </p>
          </div>
        </div>
      </Section>
      
      {/* Sekcja "Dlaczego warto" */}
      <Section 
        tytul="Dlaczego warto?"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-semibold mb-1">Szybko i wygodnie</h4>
              <p className="text-gray-600">Znajdź idealny prezent w mniej niż minutę</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold mb-1">Spersonalizowane propozycje</h4>
              <p className="text-gray-600">AI dobiera prezenty idealnie pasujące do osoby</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold mb-1">Kreatywne pomysły</h4>
              <p className="text-gray-600">Odkryj oryginalne prezenty, o których nie pomyślałbyś</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <h4 className="font-semibold mb-1">Dopasowane do budżetu</h4>
              <p className="text-gray-600">Prezenty w Twoim zakresie cenowym</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
    </>
  );
}
