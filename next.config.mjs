/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "api.telegram.org",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
    });

    config.stats = "errors-only";

    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found/,
      /Some dependencies are not being included/,
    ];

    config.resolve.fallback = {
      fs: false,
      module: false,
    };

    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
