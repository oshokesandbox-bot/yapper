import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@yapper/shared", "@yapper/ui"],
  typescript: {
    // TS internal crash (Debug Failure) during Next.js type-checking step.
    // Actual typecheck runs via pnpm typecheck in CI.
    ignoreBuildErrors: true
  }
};

export default nextConfig;
