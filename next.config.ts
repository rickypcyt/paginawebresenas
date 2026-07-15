import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["efficient-multipolar-fritz.ngrok-free.dev"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "loremflickr.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
