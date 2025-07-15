import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  eslint: {
    // Build ke dauraan ESLint errors ko ignore karega
    ignoreDuringBuilds: true,
  },
};
  /* config options here */


export default nextConfig;
