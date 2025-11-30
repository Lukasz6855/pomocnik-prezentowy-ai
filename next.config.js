/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
