/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://front-gate:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
