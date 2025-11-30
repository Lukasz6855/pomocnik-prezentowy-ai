// Główna strona aplikacji - strona główna z formularzem i wyszukiwarką
'use client';

import { useState } from 'react';
import GiftCard from '@/components/GiftCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Section from '@/components/Section';
import HeroSection from '@/components/HeroSection';
import { Prezent, DaneFormularza } from '@/lib/types';
import { Sparkles, Wand2 } from 'lucide-react';

// Lista zainteresowań dostępnych w formularzu
const ZAINTERESOWANIA = [
  'Sport i fitness',
  'Książki i czytanie',
  'Technologia i gadżety',
  'Gotowanie i kulinaria',
  'Podróże',
  'Muzyka',
  'Filmy i seriale',
  'Gry (planszowe/komputerowe)',
  'Sztuka i rękodzieło',
  'Fotografia'
];

// Lista relacji
const RELACJE = [
  'Mąż/Żona',
  'Dziecko',
  'Partner/Partnerka',
  'Mama',
  'Tata',
  'Dziadek',
  'Babcia',
  'Szef/Szefowa',
  'Znajomy/Znajoma',
  'Brat/Siostra'
];

export default function StronaGlowna() {
  // Stan komponentu
  const [aktywnyTab, setAktywnyTab] = useState<'formularz' | 'opis'>('formularz'); // Aktywna zakładka
  const [ladowanie, setLadowanie] = useState(false); // Czy trwa ładowanie
  const [prezenty, setPrezenty] = useState<Prezent[]>([]); // Lista wygenerowanych prezentów
  const [komunikatBledu, setKomunikatBledu] = useState<string | null>(null); // Komunikat błędu
  
  // Stan formularza
  const [okazja, setOkazja] = useState('urodziny');
  const [okazjaInna, setOkazjaInna] = useState('');
  const [plec, setPlec] = useState('kobieta');
  const [relacja, setRelacja] = useState('Znajomy/Znajoma');
  const [relacjaInna, setRelacjaInna] = useState('');
  const [wiek, setWiek] = useState('');
  const [zainteresowania, setZainteresowania] = useState<string[]>(['Sport i fitness']);
  const [zainteresowaniaInne, setZainteresowaniaInne] = useState('');
  const [stylPrezentu, setStylPrezentu] = useState('normalny');
  const [formaPrezentu, setFormaPrezentu] = useState<string[]>(['rzeczowy']);
  const [budzetOd, setBudzetOd] = useState('');
  const [budzetDo, setBudzetDo] = useState('');
  
  // Stan opisu tekstowego
  const [opisTekstowy, setOpisTekstowy] = useState('');
  
  // Obsługa zaznaczania zainteresowań (checkbox)
  const obsluzZainteresowanie = (zainteresowanie: string) => {
    if (zainteresowania.includes(zainteresowanie)) {
      // Usunięcie zainteresowania
      setZainteresowania(zainteresowania.filter(z => z !== zainteresowanie));
    } else {
      // Dodanie zainteresowania
      setZainteresowania([...zainteresowania, zainteresowanie]);
    }
  };
  
  // Obsługa zaznaczania formy prezentu (checkbox)
  const obsluzFormePrezentu = (forma: string) => {
    if (formaPrezentu.includes(forma)) {
      // Usunięcie formy
      setFormaPrezentu(formaPrezentu.filter(f => f !== forma));
    } else {
      // Dodanie formy
      setFormaPrezentu([...formaPrezentu, forma]);
    }
  };
  
  // Funkcja wysyłająca zapytanie do API
  const wyslijZapytanie = async (typ: 'formularz' | 'opis' | 'losowy', dane?: any) => {
    setLadowanie(true); // Włączenie loadera
    setKomunikatBledu(null); // Wyczyszczenie błędów
    setPrezenty([]); // Wyczyszczenie poprzednich wyników
    
    try {
      // Wysłanie żądania POST do API
      const odpowiedz = await fetch('/api/generuj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typ: typ,
          dane: dane || {}
        }),
      });
      
      // Sprawdzenie statusu odpowiedzi
      if (!odpowiedz.ok) {
        throw new Error('Błąd podczas generowania propozycji');
      }
      
      // Parsowanie odpowiedzi JSON
      const wynik = await odpowiedz.json();
      
      // Ustawienie prezentów w stanie
      if (wynik.success && wynik.prezenty) {
        setPrezenty(wynik.prezenty);
        
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
  
  // Obsługa wysłania formularza
  const obsluzWyslanieFomularza = (e: React.FormEvent) => {
    e.preventDefault(); // Zapobieganie domyślnej akcji formularza
    
    // Przygotowanie danych formularza
    const daneFormularza: DaneFormularza = {
      okazja: okazja === 'inne' ? okazjaInna : okazja,
      plec: plec,
      relacja: relacja === 'Inne' ? relacjaInna : relacja,
      wiek: wiek,
      zainteresowania: zainteresowaniaInne 
        ? [...zainteresowania, zainteresowaniaInne] 
        : zainteresowania,
      stylPrezentu: stylPrezentu,
      formaPrezentu: formaPrezentu,
      budzetOd: budzetOd,
      budzetDo: budzetDo
    };
    
    // Wysłanie zapytania
    wyslijZapytanie('formularz', daneFormularza);
  };
  
  // Obsługa wysłania opisu
  const obsluzWyslanieOpisu = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!opisTekstowy.trim()) {
      setKomunikatBledu('Proszę wpisać opis');
      return;
    }
    
    // Wysłanie zapytania
    wyslijZapytanie('opis', { opis: opisTekstowy });
  };
  
  // Obsługa losowania prezentu
  const obsluzLosujPrezent = () => {
    wyslijZapytanie('losowy', {});
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Główna sekcja wyszukiwania */}
      <Section 
        id="formularz"
        tytul="Wyszukaj Prezent" 
        opis="Wypełnij formularz lub opisz sytuację - AI znajdzie idealne propozycje!"
        className="py-16"
      >
        <div className="max-w-4xl mx-auto">
          {/* Przycisk losowego prezentu */}
          <div className="flex justify-center mb-8">
            <button
              onClick={obsluzLosujPrezent}
              disabled={ladowanie}
              className="group bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Losuj Kreatywny Prezent
              <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </button>
          </div>
          
          {/* Zakładki: Formularz / Opis */}
          <div className="flex border-b-2 border-purple-200 mb-8 bg-white rounded-t-2xl overflow-hidden shadow-lg">
            <button
              onClick={() => setAktywnyTab('formularz')}
              className={`flex-1 py-4 px-6 font-bold transition-all duration-300 ${
                aktywnyTab === 'formularz'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              📋 Wypełnij Formularz
            </button>
            <button
              onClick={() => setAktywnyTab('opis')}
              className={`flex-1 py-4 px-6 font-bold transition-all duration-300 ${
                aktywnyTab === 'opis'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              ✍️ Opisz Swoimi Słowami
            </button>
          </div>
          
          {/* Formularz szczegółowy */}
          {aktywnyTab === 'formularz' && (
            <form onSubmit={obsluzWyslanieFomularza} className="space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-purple-100">
              {/* Okazja */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🎉 Okazja *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{['urodziny', 'imieniny', 'chrzest', 'ślub', 'rocznica ślubu', 'Mikołaj', 'pod choinkę', 'walentynkowy'].map(o => (
                    <label key={o} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="okazja"
                        value={o}
                        checked={okazja === o}
                        onChange={(e) => setOkazja(e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">{o.charAt(0).toUpperCase() + o.slice(1)}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="okazja"
                      value="inne"
                      checked={okazja === 'inne'}
                      onChange={(e) => setOkazja(e.target.value)}
                      className="w-4 h-4 text-primary-600"
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
                    className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
              
              {/* Płeć */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Płeć obdarowanej osoby *
                </label>
                <div className="flex gap-4">
                  {['kobieta', 'mężczyzna', 'para/małżeństwo'].map(p => (
                    <label key={p} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="plec"
                        value={p}
                        checked={plec === p}
                        onChange={(e) => setPlec(e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Relacja */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relacja
                </label>
                <select
                  value={relacja}
                  onChange={(e) => setRelacja(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {RELACJE.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="Inne">Inne</option>
                </select>
                {relacja === 'Inne' && (
                  <input
                    type="text"
                    value={relacjaInna}
                    onChange={(e) => setRelacjaInna(e.target.value)}
                    placeholder="Wpisz relację..."
                    className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
              
              {/* Wiek */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wiek lub rocznica
                </label>
                <input
                  type="text"
                  value={wiek}
                  onChange={(e) => setWiek(e.target.value)}
                  placeholder="np. 30 lat, 10 rocznica ślubu..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Zainteresowania */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zainteresowania (możesz wybrać więcej)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ZAINTERESOWANIA.map(z => (
                    <label key={z} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={zainteresowania.includes(z)}
                        onChange={() => obsluzZainteresowanie(z)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-sm">{z}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" disabled className="w-4 h-4 rounded" />
                    <span className="text-sm">Inne:</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={zainteresowaniaInne}
                  onChange={(e) => setZainteresowaniaInne(e.target.value)}
                  placeholder="Wpisz inne zainteresowania..."
                  className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Styl prezentu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Styl prezentu
                </label>
                <select
                  value={stylPrezentu}
                  onChange={(e) => setStylPrezentu(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="normalny">Normalny</option>
                  <option value="praktyczny">Praktyczny</option>
                  <option value="formalny/oficjalny">Formalny/Oficjalny</option>
                  <option value="biznesowy/służbowy">Biznesowy/Służbowy</option>
                  <option value="na luzie">Na luzie</option>
                  <option value="śmieszny">Śmieszny</option>
                  <option value="luksusowy">Luksusowy</option>
                  <option value="kreatywny">Kreatywny</option>
                  <option value="handmade">Handmade</option>
                </select>
              </div>
              
              {/* Forma prezentu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Forma prezentu (możesz wybrać więcej)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'rzeczowy', label: 'Rzeczowy' },
                    { value: 'bilet', label: 'Bilet na event/koncert' },
                    { value: 'odpoczynek', label: 'Odpoczynek (hotel/spa)' },
                    { value: 'voucher', label: 'Voucher prezentowy' }
                  ].map(f => (
                    <label key={f.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formaPrezentu.includes(f.value)}
                        onChange={() => obsluzFormePrezentu(f.value)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-sm">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Budżet */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budżet (PLN)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    value={budzetOd}
                    onChange={(e) => setBudzetOd(e.target.value)}
                    placeholder="Od"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={budzetDo}
                    onChange={(e) => setBudzetDo(e.target.value)}
                    placeholder="Do"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Przycisk wysłania */}
              <button
                type="submit"
                disabled={ladowanie}
                className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ladowanie ? 'Szukam...' : '🔍 Wyszukaj Prezenty'}
              </button>
            </form>
          )}
          
          {/* Formularz z opisem tekstowym */}
          {aktywnyTab === 'opis' && (
            <form onSubmit={obsluzWyslanieOpisu} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Opisz osobę, dla której szukasz prezentu lub jakiego prezentu potrzebujesz
                </label>
                <textarea
                  value={opisTekstowy}
                  onChange={(e) => setOpisTekstowy(e.target.value)}
                  rows={6}
                  placeholder="Np. Szukam prezentu dla mojej mamy na 60. urodziny. Uwielbia gotować, czytać kryminały i pić dobrą kawę. Budżet do 300 PLN..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={ladowanie}
                className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ladowanie ? 'Szukam...' : '🔍 Wyszukaj Prezenty'}
              </button>
            </form>
          )}
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
          tytul={`🎁 Znalazłem ${prezenty.length} ${prezenty.length === 1 ? 'prezent' : 'prezentów'} dla Ciebie!`}
          opis="Wybierz najlepszy prezent i dodaj do ulubionych"
        >
          <div className="grid gap-6">
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
  );
}
