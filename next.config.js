/** @type {import('next').NextConfig} */
const domainConfig = require("./next.config.domains")

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost", "uploadcare.com", "dashboard.barkprotocol.net"],
  },
  ...domainConfig,
}

module.exports = nextConfig

