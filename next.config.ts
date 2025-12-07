import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        fs: { browser: false },
        net: { browser: false },
        tls: { browser: false },
      },
    },
  },
};

export default nextConfig;
