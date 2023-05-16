/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@acme/email-templates"],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
