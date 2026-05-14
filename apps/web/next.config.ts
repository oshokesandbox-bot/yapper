import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/yapper";

const nextConfig: NextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ["@yapper/shared", "@yapper/ui"],
  ...(isGithubPages ? {
    output: "export",
    basePath: repoBasePath,
    assetPrefix: repoBasePath,
    images: { unoptimized: true }
  } : {})
};

export default nextConfig;
