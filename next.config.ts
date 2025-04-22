// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {},
    middlewarePrefetch: 'flexible',
    typedRoutes: true,
  },

  eslint: {
    ignoreDuringBuilds: true, //!isProd, // evita errores de lint en build de producción
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
