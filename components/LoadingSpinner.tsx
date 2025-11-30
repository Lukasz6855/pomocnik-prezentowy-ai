// Komponent animowanego spinnera ładowania
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animowany spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* Tekst ładowania */}
      <p className="mt-4 text-gray-600 font-medium">
        Szukam najlepszych prezentów... 🎁
      </p>
      
      {/* Dodatkowy tekst informacyjny */}
      <p className="mt-2 text-sm text-gray-500">
        To może potrwać kilka sekund
      </p>
    </div>
  );
}
