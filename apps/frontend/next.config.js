/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@docintel/ui', '@docintel/types', '@docintel/utils', '@docintel/config'],
};

module.exports = nextConfig;

