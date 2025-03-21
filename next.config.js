/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = {
      canvas: 'commonjs canvas', // Prevents Next.js from bundling 'canvas'
    };
    return config;
  },
};

module.exports = nextConfig;
