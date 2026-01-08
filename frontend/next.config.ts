import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Railway deployment
  output: 'standalone',
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Image optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion'
    ],
    optimizeCss: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },
  
  // CRITICAL: Proxy API requests to the backend FastAPI server
  // DO NOT REMOVE - Required for backend communication
  async rewrites() {
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
