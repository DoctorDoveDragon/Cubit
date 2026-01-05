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
} catch (error: unknown) {
  // Bundle analyzer not available (production environment)
  // Only catch MODULE_NOT_FOUND errors, re-throw others
  if (error && typeof error === 'object' && 'code' in error && error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
  // Use config without analyzer when module is not installed
}

export default finalConfig;
