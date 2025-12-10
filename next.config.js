/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optymalizacja wydajności
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Wyłączenie source maps w development (przyspieszenie)
  productionBrowserSourceMaps: false,
  
  // Konfiguracja obrazków - dozwolone domeny zewnętrzne
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.allegroimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'allegro.pl',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
