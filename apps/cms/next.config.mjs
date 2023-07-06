import "./env.mjs";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "avatar.vercel.sh",
      "www.google.com",
      "relesed.com",
      "cdn.nicholasgriffin.dev",
      "nicholasgriffin.dev",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
