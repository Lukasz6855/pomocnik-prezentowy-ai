// Root layout - główny layout aplikacji
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Konfiguracja czcionek
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

// Metadane strony (SEO)
export const metadata: Metadata = {
  metadataBase: new URL('https://pomocnikprezentowy.pl'),
  title: {
    default: 'Pomocnik Prezentowy AI - Znajdź Idealny Prezent w 30 Sekund',
    template: '%s | Pomocnik Prezentowy AI',
  },
  description: 'Sztuczna inteligencja pomoże Ci wybrać najlepszy prezent dla każdej osoby i okazji. Spersonalizowane propozycje prezentów dopasowane do budżetu i zainteresowań.',
  keywords: ['prezenty', 'AI', 'sztuczna inteligencja', 'pomysły na prezent', 'urodziny', 'święta', 'asystent prezentowy', 'rekomendacje prezentów', 'chatbot prezentowy'],
  authors: [{ name: 'Pomocnik Prezentowy AI' }],
  creator: 'Pomocnik Prezentowy AI',
  publisher: 'Pomocnik Prezentowy AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://pomocnikprezentowy.pl',
    siteName: 'Pomocnik Prezentowy AI',
    title: 'Pomocnik Prezentowy AI - Znajdź Idealny Prezent w 30 Sekund',
    description: 'Sztuczna inteligencja pomoże Ci wybrać najlepszy prezent dla każdej osoby i okazji. Spersonalizowane propozycje prezentów dopasowane do budżetu i zainteresowań.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Pomocnik Prezentowy AI - Znajdź Idealny Prezent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomocnik Prezentowy AI - Znajdź Idealny Prezent w 30 Sekund',
    description: 'Sztuczna inteligencja pomoże Ci wybrać najlepszy prezent dla każdej osoby i okazji.',
    images: ['/opengraph-image'],
  },
  verification: {
    google: 'your-google-verification-code', // Dodaj po weryfikacji w Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Nawigacja */}
        <Navigation />
        
        {/* Główna zawartość */}
        <main>
          {children}
        </main>
        
        {/* Stopka */}
        <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-16 overflow-hidden">
          {/* Animowane tło */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Kolumna 1 - Logo i opis */}
              <div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                  🎁 Pomocnik Prezentowy AI
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Inteligentny asystent w wyborze idealnego prezentu. 
                  Wykorzystujemy najnowsze modele AI do generowania spersonalizowanych propozycji.
                </p>
                <div className="mt-6 flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                    <span>📱</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                    <span>💬</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                    <span>📧</span>
                  </a>
                </div>
              </div>
              
              {/* Kolumna 2 - Linki */}
              <div>
                <h4 className="font-bold text-lg mb-4 text-purple-300">Nawigacja</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      Wyszukiwarka
                    </a>
                  </li>
                  <li>
                    <a href="/ulubione" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      Ulubione
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/o-stronie" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      O stronie
                    </a>
                  </li>
                  <li>
                    <a href="/polityka-prywatnosci" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      Polityka prywatności
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Kolumna 3 - Informacje techniczne */}
              <div>
                <h4 className="font-bold text-lg mb-4 text-pink-300">Technologia</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Status: Online
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Wersja: MVP 1.0
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    OpenAI GPT-4o-mini
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Next.js 14 + TypeScript
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-white/10 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Pomocnik Prezentowy AI. Wszystkie prawa zastrzeżone.
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Projekt MVP. Propozycje generowane przez AI mogą nie być w pełni dokładne.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
