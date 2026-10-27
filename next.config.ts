import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Do not pipe *.css through @tailwindcss/turbopack: this project uses plain
  // CSS + CSS Modules, and that loader strips module exports (className → undefined).
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
