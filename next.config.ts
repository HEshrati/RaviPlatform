import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // تصاویر Unsplash
      },
      {
        protocol: "https",
        hostname: "placehold.co", // سرویس ایجاد تصویر جایگزین برای طرح‌ها
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // سرویس ایجاد آواتار بر اساس نام
      },
    ],
  },
};

export default nextConfig;
