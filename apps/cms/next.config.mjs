import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  reactStrictMode: false,
};

export default withContentlayer(nextConfig)
