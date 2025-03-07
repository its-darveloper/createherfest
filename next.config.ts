// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'createherfest.notion.site',
      'randomuser.me',
      'cdn.sanity.io'  // For Sanity-hosted images
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/claim',
        destination: 'https://links.unstoppabledomains.com/e/c/eyJlbWFpbF9pZCI6ImRnU1dqUVVEQU9XYWt3SGptcE1CQVpWczFQdktIRWVHQUlMcEJkRzFLUT09IiwiaHJlZiI6Imh0dHBzOi8vdW5zdG9wcGFibGV3ZWIuY28vM1h0VllVNyIsImludGVybmFsIjoiOTY4ZDA1NTBlMzVjZTU5YTkzMDEiLCJsaW5rX2lkIjoyNjQwNX0/d1b2cff2e6009cc9a88f7bfadc66acf6ffb6cbfe632aeffb9f9704ec75ba57e8',
        permanent: true, // Use false for temporary redirect (307)
      },
    ];
  },
};

module.exports = nextConfig;