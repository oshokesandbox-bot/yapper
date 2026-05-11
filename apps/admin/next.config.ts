import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@yapper/shared", "@yapper/ui"]
};

export default nextConfig;
