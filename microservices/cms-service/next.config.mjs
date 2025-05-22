import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: 'http://localhost:8085'
  // Your Next.js config here
}

export default withPayload(nextConfig, { devBundleServerPackages: false , transpilePackages: ['@payloadcms/ui'],})
