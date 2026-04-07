import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.55', '192.168.1.115'],
  turbopack: {},
};

export default nextConfig;