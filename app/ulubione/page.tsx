// Strona Ulubione - wyświetlanie zapisanych prezentów z localStorage
'use client';

import { useState, useEffect } from 'react';
import GiftCard from '@/components/GiftCard';
import Section from '@/components/Section';
import { Prezent } from '@/lib/types';

export default function StronaUlubione() {
  // Stan przechowujący ulubione prezenty
  const [ulubione, setUlubione] = useState<Prezent[]>([]);
  // Stan ładowania (dla hydration)
  const [zaladowano, setZaladowano] = useState(false);
  
  // Załadowanie ulubionych z localStorage po zamontowaniu komponentu
  useEffect(() => {
    const ulubionePrezenty = JSON.parse(localStorage.getItem('ulubione') || '[]');
    setUlubione(ulubionePrezenty);
    setZaladowano(true);
  }, []);
  
  // Usunięcie prezentu z ulubionych
  const usunZUlubionych = (prezent: Prezent) => {
    const noweUlubione = ulubione.filter(u => u.title !== prezent.title);
    setUlubione(noweUlubione);
    localStorage.setItem('ulubione', JSON.stringify(noweUlubione));
  };
  
  // Wyczyszczenie wszystkich ulubionych
  const wyczyscWszystkie = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie ulubione prezenty?')) {
      setUlubione([]);
      localStorage.setItem('ulubione', JSON.stringify([]));
    }
  };
  
  // Przed załadowaniem - pokazujemy loader
  if (!zaladowano) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie ulubionych...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Section 
        tytul="❤️ Twoje Ulubione Prezenty"
        opis={ulubione.length > 0 
          ? `Zapisałeś ${ulubione.length} ${ulubione.length === 1 ? 'prezent' : ulubione.length < 5 ? 'prezenty' : 'prezentów'}`
          : 'Nie masz jeszcze żadnych ulubionych prezentów'
        }
      >
        {/* Lista ulubionych prezentów */}
        {ulubione.length > 0 ? (
          <div className="space-y-6">
            {/* Przycisk czyszczenia */}
            <div className="flex justify-end">
              <button
                onClick={wyczyscWszystkie}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                🗑️ Wyczyść wszystkie
              </button>
            </div>
            
            {/* Karty prezentów */}
            <div className="grid gap-6">
              {ulubione.map((prezent, index) => (
                <GiftCard
                  key={index}
                  prezent={prezent}
                  numer={index + 1}
                  czyUlubiony={true}
                  onToggleUlubiony={() => usunZUlubionych(prezent)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Pusty stan - brak ulubionych
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Brak ulubionych prezentów
            </h3>
            <p className="text-gray-500 mb-6">
              Dodaj prezenty do ulubionych klikając ikonkę serduszka 🤍
            </p>
            <a
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors"
            >
              🔍 Wyszukaj Prezenty
            </a>
          </div>
        )}
      </Section>
      
      {/* Informacja o localStorage */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>ℹ️ Informacja:</strong> Ulubione prezenty są zapisywane lokalnie w Twojej przeglądarce. 
            Po wyczyszczeniu danych przeglądarki lub zmianie urządzenia lista zostanie utracona.
          </p>
        </div>
      </div>
    </div>
  );
}
