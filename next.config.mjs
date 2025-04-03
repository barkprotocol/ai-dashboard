/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This will allow the build to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

