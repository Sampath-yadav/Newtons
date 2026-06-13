import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Don't run ESLint during `next build`. Linting is a dev/CI concern (run
  // `pnpm lint`); keeping it out of the production build means a stray lint
  // warning can never block a Vercel deploy, and removes the "ESLint must be
  // installed" build warning. TypeScript type-checking still runs in the build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
