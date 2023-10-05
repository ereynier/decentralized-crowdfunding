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
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "https://rpc.sepolia.org/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
