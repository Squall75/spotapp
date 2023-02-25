/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
