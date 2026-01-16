import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { Categories } from './collections/blog/categories';
import { Posts } from './collections/blog/post';
import { LegalDocs } from './collections/legal/legal-docs';
import { Media } from './collections/system/media';
import { User } from './collections/system/user';
import { loadSecret } from './lib/secrets-manager';

const systemCollections = [User, Media];
const docCollections = [LegalDocs];
const contentCollections = [Posts, Categories];

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// ============================================================================
// CRITICAL: Load secrets IMMEDIATELY when config is imported
// This ensures secrets are available before Mongoose adapter initializes
// ============================================================================

const DATABASE_URL = loadSecret('DATABASE_URL', { required: true });
const DATABASE_NAME = loadSecret('DATABASE_NAME', { required: true });
const PAYLOAD_SECRET = loadSecret('PAYLOAD_SECRET', { required: true });

// Validate we got the secrets
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL secret is required but not available');
}
if (!DATABASE_NAME) {
  throw new Error('DATABASE_NAME secret is required but not available');
}
if (!PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET secret is required but not available');
}

// ============================================================================
// Build Payload configuration with pre-loaded secrets
// ============================================================================

export default buildConfig({
  serverURL:
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://int.staxless.com/',
  admin: {
    user: User.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [...systemCollections, ...docCollections, ...contentCollections],
  editor: lexicalEditor(),

  // Use the pre-loaded secret variables
  secret: 'd038e41b336abda460724f81',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: 'mongodb+srv://staxless-app-user:TtreDMdmVk6QVmke@staxless-cluster.pzqhjuw.mongodb.net/?appName=staxless-cluster/db',
    connectOptions: {
      dbName: 'db',
    },
  }),

  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: [],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
});
