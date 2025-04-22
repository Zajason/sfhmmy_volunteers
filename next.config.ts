// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // …your other config

  // EXACT origins (protocol + host + port)
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.107:3000",
  ],
};

export default nextConfig;
