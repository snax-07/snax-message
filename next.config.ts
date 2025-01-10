import type { NextConfig } from "next";

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
