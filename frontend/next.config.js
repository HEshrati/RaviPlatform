const path = require("path");
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
