import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Using standard Next.js deployment instead of standalone mode
};

export default withBundleAnalyzer(nextConfig);
