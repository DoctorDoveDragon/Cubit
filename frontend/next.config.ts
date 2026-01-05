import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using standard Next.js deployment instead of standalone mode
};

// Only use bundle analyzer if it's available (development environment)
// In production, the devDependency may not be installed
let finalConfig = nextConfig;
try {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  finalConfig = withBundleAnalyzer(nextConfig);
} catch (error) {
  // Bundle analyzer not available (production environment)
  // Use config without analyzer
}

export default finalConfig;
