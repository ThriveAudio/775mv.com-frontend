/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: true,
      }
    ]
  },
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  }
}

module.exports = nextConfig
