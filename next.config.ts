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
};

module.exports = nextConfig;