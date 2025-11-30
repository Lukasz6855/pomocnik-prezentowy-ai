// Logo SVG z ikoną prezentu
'use client';

import { Gift } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Ikona prezentu w okręgu z gradientem */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl blur-md opacity-75 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 p-3 rounded-xl shadow-xl">
          <Gift className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Tekst logo */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
            Pomocnik
          </span>
          <span className="text-xs text-gray-600 -mt-1">
            Prezentowy AI
          </span>
        </div>
      )}
    </div>
  );
}
