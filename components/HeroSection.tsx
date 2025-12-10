// Hero section - baner powitalny na stronie głównej
'use client';

import { Sparkles, ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToForm = () => {
    const element = document.getElementById('formularz');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJakToDziala = () => {
    const element = document.getElementById('jak-to-dziala');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 text-white">
      {/* Obrazek tła z Unsplash - prezenty/święta */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070')"
        }}
      />
      
      {/* Animowane kropki w tle */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Treść hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
            <Sparkles className="w-4 h-4" />
            Powered by AI • 100% za darmo
          </div>

          {/* Główny tytuł */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Znajdź Idealny Prezent
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              z AI 🎁
            </span>
          </h1>

          {/* Podtytuł */}
          <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Sztuczna inteligencja pomoże Ci znaleźć perfekcyjny prezent 
            dla każdej osoby i okazji. Wystarczy wypełnić formularz!
          </p>

          {/* Przyciski CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={scrollToForm}
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Znajdź prezent teraz
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
            
            <button
              onClick={scrollToJakToDziala}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Zobacz jak to działa
            </button>
          </div>

          {/* Statystyki */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl sm:text-4xl font-bold">1000+</div>
              <div className="text-purple-200 text-sm mt-1">Pomysłów</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">AI</div>
              <div className="text-purple-200 text-sm mt-1">Technologia</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">0 PLN</div>
              <div className="text-purple-200 text-sm mt-1">Całkowicie za darmo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fala na dole */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
