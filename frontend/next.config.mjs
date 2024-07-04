/** @type {import('next').NextConfig} */
export const output = "standalone";
export function webpack(config) {
  config.watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
  };
  return config;
}
export async function rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://front-gate:8080/:path*",
    },
  ];
}
