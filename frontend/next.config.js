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

  },
}

module.exports = nextConfig
