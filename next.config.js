/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for development with NextAuth
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath: '/triclub', // Commented out for development
  // assetPrefix: '/triclub/', // Commented out for development
}

module.exports = nextConfig