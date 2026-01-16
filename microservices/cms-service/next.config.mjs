import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'int.staxless.com',
        'staxless.com', // prod domain when you add it
        'localhost:3000', // local dev
      ],
    },
  },
  basePath: '/cms',
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? 'https://int.staxless.com/cms/admin'
      : '/admin',
  output: 'standalone',
};

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
  transpilePackages: ['@payloadcms/ui'],
});
