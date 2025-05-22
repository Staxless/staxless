import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { logoutEndpoint } from './lib/logoutEndpoint';

// Collections
import { User } from './collections/system/User';
import { Media } from './collections/system/Media';

const systemCollections = [User, Media];


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: User.slug,      
    importMap: {
      baseDir: path.resolve(dirname),
    },
    

  },
  endpoints: [logoutEndpoint],
  collections: [...systemCollections],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [payloadCloudPlugin()],

});