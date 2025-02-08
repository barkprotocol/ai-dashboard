/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ["images.unsplash.com", "ucarecdn.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Custom webpack configs can be added here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig

v