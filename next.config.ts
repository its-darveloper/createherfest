// next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig; // <-- Changed from module.exports to export default