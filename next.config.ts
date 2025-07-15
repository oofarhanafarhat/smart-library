import type { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // build ke dauraan ESLint errors ko ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
