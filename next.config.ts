// next.config.js
import type { NextConfig } from "next";

const isProd = process.env.VERCEL_ENV === 'production';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, ///!isProd, // Solo valida ESLint en producción
  },
  experimental: {
    middlewarePrefetch: true, // solo si quieres prefetch
  },
};

export default nextConfig;


