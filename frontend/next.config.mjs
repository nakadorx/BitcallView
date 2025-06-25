/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  // basePath: process.env.BASEPATH || '',
  // trailingSlash: false, // keep clean URLs (no slash at end)
  experimental: {
    optimizeCss: true
  },
  images: {
    unoptimized: true
  },

  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
