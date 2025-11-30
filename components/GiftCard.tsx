// Komponent karty pojedynczego prezentu
'use client';

import { Prezent } from '@/lib/types';
import { useState } from 'react';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';

interface GiftCardProps {
  prezent: Prezent;         // Dane prezentu
  numer: number;            // Numer na liście (1, 2, 3...)
  czyUlubiony?: boolean;    // Czy prezent jest w ulubionych
  onToggleUlubiony?: () => void; // Callback do dodania/usunięcia z ulubionych
}

export default function GiftCard({ prezent, numer, czyUlubiony = false, onToggleUlubiony }: GiftCardProps) {
  // Stan dla komunikatu o dodaniu do ulubionych
  const [pokazKomunikat, setPokazKomunikat] = useState(false);
  
  // Obsługa kliknięcia serduszka (dodanie do ulubionych)
  const obsluzKlikniecieSerca = () => {
    if (onToggleUlubiony) {
      onToggleUlubiony();
      
      // Pokazanie komunikatu tylko przy dodawaniu (nie przy usuwaniu)
      if (!czyUlubiony) {
        setPokazKomunikat(true);
        // Ukrycie komunikatu po 3 sekundach
        setTimeout(() => setPokazKomunikat(false), 3000);
      }
    }
  };
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border-2 border-purple-100 hover:border-purple-300 hover:-translate-y-2">
      {/* Nagłówek karty z numerem i serduszkiem */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 px-6 py-5 flex justify-between items-center relative overflow-hidden">
        {/* Animowane tło */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <span className="bg-white text-purple-600 font-bold px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            #{numer}
          </span>
          <h3 className="text-white font-bold text-lg drop-shadow-lg">
            {prezent.title}
          </h3>
        </div>
        
        {/* Przycisk dodania do ulubionych */}
        {onToggleUlubiony && (
          <button
            onClick={obsluzKlikniecieSerca}
            className="relative z-10 transition-transform hover:scale-125 active:scale-95"
            aria-label={czyUlubiony ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <Heart 
              className={`w-7 h-7 transition-colors ${czyUlubiony ? 'fill-red-500 text-red-500' : 'text-white hover:fill-red-400 hover:text-red-400'}`}
            />
            {czyUlubiony ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      
      {/* Komunikat o dodaniu do ulubionych */}
      {pokazKomunikat && (
        <div className="bg-green-100 border-l-4 border-green-500 px-4 py-3 text-green-700 text-sm">
          ✓ Dodano do ulubionych!
        </div>
      )}
      
      {/* Treść karty */}
      <div className="p-6 space-y-4">
        {/* Miniaturka zdjęcia produktu - PRZEZ PROXY */}
        {prezent.imageUrl && (
          <div className="flex justify-center">
            <img 
              src={prezent.imageUrl}
              alt={prezent.title}
              className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-md"
              onError={(e) => {
                // Fallback jeśli obrazek się nie załaduje
                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Brak+zdjęcia';
              }}
            />
          </div>
        )}
        
        {/* Opis prezentu */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Opis
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {prezent.description}
          </p>
        </div>
        
        {/* Dlaczego ten prezent */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Dlaczego ten prezent?
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {prezent.why}
          </p>
        </div>
        
        {/* Szacunkowa cena */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
          <h4 className="text-sm font-bold text-purple-600 uppercase mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Szacunkowa cena
          </h4>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {prezent.price_estimate}
          </p>
        </div>
        
        {/* Linki do sklepów - TYLKO SKLEPY Z TĄ OFERTĄ */}
        {prezent.affiliate_links && prezent.affiliate_links.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              Gdzie kupić?
            </h4>
            {prezent.source === 'allegro' && (
              <p className="text-xs text-green-600 mb-4 bg-green-50 px-3 py-2 rounded-lg font-medium">
                ✅ Konkretna oferta z Allegro
              </p>
            )}
            {prezent.source === 'other' && (
              <p className="text-xs text-blue-600 mb-4 bg-blue-50 px-3 py-2 rounded-lg font-medium">
                🔍 Link do wyszukiwania w sklepie {prezent.shopName}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {prezent.affiliate_links.map((link, index) => {
                // Określenie nazwy sklepu z linku lub z prezent.shopName
                let shopDisplayName = prezent.shopName || 'Sklep';
                
                // Jeśli brak shopName, wyciągnij z URL
                if (!prezent.shopName) {
                  try {
                    const urlObj = new URL(link);
                    shopDisplayName = urlObj.hostname.replace('www.', '').split('.')[0];
                    shopDisplayName = shopDisplayName.charAt(0).toUpperCase() + shopDisplayName.slice(1);
                  } catch {
                    shopDisplayName = 'Sklep';
                  }
                }
                
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 text-sm font-bold"
                  >
                    <ShoppingBag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    {shopDisplayName}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
