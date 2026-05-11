import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/yapper";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  transpilePackages: ["@yapper/shared", "@yapper/ui"],
  ...(isGithubPages ? { basePath: repoBasePath, assetPrefix: repoBasePath } : {})
};

export default nextConfig;
