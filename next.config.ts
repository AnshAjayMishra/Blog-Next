/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable tracing
  experimental: {
    tracingIgnores: ['**/*'],
  }
}

module.exports = nextConfig