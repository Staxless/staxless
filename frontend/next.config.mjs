/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'int.staxless.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'cms-service',
        port: '8085',
      },
      {
        protocol: 'http',
        hostname: 'kong-api-gateway',
        port: '8000',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack(config) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  rewrites() {
    return [
      // IMPORTANT: More specific routes MUST come first
      // CMS media files - MOVED TO TOP
      {
        source: '/cms/api/media/:path*',
        destination: 'http://kong-api-gateway:8000/cms/api/media/:path*',
      },
      // CMS admin requests
      {
        source: '/cms/admin/:path*',
        destination: 'http://kong-api-gateway:8000/cms/admin/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'http://kong-api-gateway:8000/cms/admin/:path*',
      },
      // CMS API requests - LESS specific, comes after media
      {
        source: '/cms/api/:path*',
        destination: 'http://kong-api-gateway:8000/cms/api/:path*',
      },
      // General API requests
      {
        source: '/api/:path*',
        destination: 'http://kong-api-gateway:8000/:path*',
      },
    ];
  },
};
export default nextConfig;
