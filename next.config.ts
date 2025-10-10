// this config can be used in other projects as well
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  // Keep experimental features empty. Do not enable `experimental.ppr` unless
  // you're running the latest Next.js canary that supports it.
  experimental: {},
};

export default nextConfig;
