module.exports = {
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "/:path*",
        },
      ]
    },
    async redirects() {
      return []
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
          ],
        },
      ]
    },
  }
  
  