// Komponent uniwersalnej sekcji z tytułem i opcjonalnym opisem
import React from 'react';

interface SectionProps {
  tytul: string;           // Tytuł sekcji
  opis?: string;           // Opcjonalny opis pod tytułem
  children?: React.ReactNode; // Zawartość sekcji
  tloCiemne?: boolean;     // Czy użyć ciemnego tła (bg-gray-50)
  className?: string;       // Dodatkowe klasy CSS
  id?: string;             // Opcjonalne ID dla linkowania
}

export default function Section({ 
  tytul, 
  opis, 
  children, 
  tloCiemne = false,
  className = '',
  id
}: SectionProps) {
  return (
    <section id={id} className={`py-12 ${tloCiemne ? 'bg-gray-50' : 'bg-white'} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {tytul}
          </h2>
          {opis && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {opis}
            </p>
          )}
        </div>
        
        {/* Zawartość sekcji */}
        <div>
          {children}
        </div>
      </div>
    </section>
  );
}
