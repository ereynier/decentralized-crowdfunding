/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    protocols: 'https',
    domains: ["res.cloudinary.com"],
    port: ""
  },
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    EXAMPLE_ID: process.env.EXAMPLE_ID,
    CHAIN: process.env.CHAIN,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
}

module.exports = nextConfig
