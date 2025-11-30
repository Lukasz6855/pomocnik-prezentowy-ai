// Komponent nawigacji - menu główne aplikacji
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Heart, BookOpen, Info, Search } from 'lucide-react';

export default function Navigation() {
  // Hook do pobrania aktualnej ścieżki URL
  const pathname = usePathname();
  
  // Funkcja pomocnicza do określenia czy link jest aktywny
  const jestAktywny = (sciezka: string) => pathname === sciezka;
  
  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Nazwa aplikacji */}
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo />
          </Link>
          
          {/* Menu nawigacyjne */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/"
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                jestAktywny('/')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Search className="w-4 h-4" />
              Wyszukiwarka
            </Link>
            <Link
              href="/ulubione"
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                jestAktywny('/ulubione')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Heart className="w-4 h-4" />
              Ulubione
            </Link>
            <Link
              href="/blog"
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                jestAktywny('/blog')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </Link>
            <Link
              href="/o-stronie"
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                jestAktywny('/o-stronie')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Info className="w-4 h-4" />
              O stronie
            </Link>
          </div>
          
          {/* Menu mobilne - przycisk hamburgera */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
          {/* Menu mobilne rozwijane */}
      <div className="md:hidden border-t border-purple-100">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
              jestAktywny('/')
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <Search className="w-4 h-4" />
            Wyszukiwarka
          </Link>
          <Link
            href="/ulubione"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
              jestAktywny('/ulubione')
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            Ulubione
          </Link>
          <Link
            href="/blog"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
              jestAktywny('/blog')
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog
          </Link>
          <Link
            href="/o-stronie"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
              jestAktywny('/o-stronie')
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <Info className="w-4 h-4" />
            O stronie
          </Link>
        </div>
      </div>
    </nav>
  );
}
