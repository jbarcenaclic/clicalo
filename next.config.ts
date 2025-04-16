import type { NextConfig } from "next";

const isProd = process.env.VERCEL_ENV === 'production';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: !isProd, // Solo valida ESLint en producción
  },
};

export default nextConfig;
