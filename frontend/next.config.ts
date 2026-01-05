import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Railway deployment
  output: 'standalone',
  
  // Proxy API requests to the backend FastAPI server
  async rewrites() {
    // In production, the backend runs on localhost:8080
    // In development, users might have it on a different port
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/execute',
        destination: `${backendUrl}/execute`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
      {
        source: '/progress',
        destination: `${backendUrl}/progress`,
      },
      {
        source: '/concepts',
        destination: `${backendUrl}/concepts`,
      },
      {
        source: '/docs',
        destination: `${backendUrl}/docs`,
      },
      {
        source: '/openapi.json',
        destination: `${backendUrl}/openapi.json`,
      },
    ];
  },
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
  // Only silently ignore MODULE_NOT_FOUND errors, re-throw all others
  const isModuleNotFoundError = error && 
    typeof error === 'object' && 
    'code' in error && 
    typeof error.code === 'string' &&
    error.code === 'MODULE_NOT_FOUND';
  
  if (!isModuleNotFoundError) {
    throw error;
  }
  // Use config without analyzer when module is not installed
}

export default finalConfig;
