/**
 * @file lucia-config.ts
 * @module lucia-config
 *
 * @description
 * This module connects to a MongoDB database and initializes the Lucia authentication system.
 * It configures the MongoDB adapter with session, user, OAuth account, and magic link collections.
 * It also sets session cookie security based on the environment and maps user/session attributes.
 *
 * @usage
 * - Import this module to get the initialized Lucia instance for authentication.
 * - Ensure environment variables `DATABASE_NAME` and `NODE_ENV` are set correctly.
 *
 * @notes
 * - Uses the MongoDB service hostname: "mongodb-service".
 * - Session cookies are secure only in production.
 * - Collections used: "session", "users", "oauthAccount", and "magicLinks".
 *
 * @requires mongodb
 * @requires @lucia-auth/adapter-mongodb
 * @requires lucia
 */

import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Lucia } from 'lucia';
import { type Collection, type Db, MongoClient } from 'mongodb';

// Extend MongodbAdapter to include OauthAccount and MagicLink properties
interface CustomMongodbAdapter extends MongodbAdapter {
  OauthAccount: Collection;
  MagicLink: Collection;
}

const DATABASE_NAME: string | undefined = process.env.DATABASE_NAME;
const MONGO_URL: string = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db: Db;

/**
 * Connects to MongoDB and initializes the Lucia authentication system.
 *
 * @async
 * @function initializeLucia
 * @returns {Promise<Lucia>} The initialized Lucia instance.
 * @throws {Error} Throws if MongoDB connection or Lucia initialization fails.
 */
export const initializeLucia = async (): Promise<Lucia> => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URL);
    db = client.db(DATABASE_NAME);

    // Initialize MongoDB adapter with session and user collections
    const adapter = new MongodbAdapter(
      db.collection('session'),
      db.collection('users')
    ) as CustomMongodbAdapter; // Cast to the extended type

    // Attach OAuth account and magic link collections to adapter
    adapter.OauthAccount = db.collection('oauthAccount');
    adapter.MagicLink = db.collection('magicLinks');

    // Initialize Lucia with adapter and session/user attribute mapping
    const lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === 'production', // Secure cookies in production
          sameSite: 'lax', // Prevent cross-site request forgery on unsafe requests
        },
      },
      getSessionAttributes: ({ country }: { country?: string }) => ({
        country,
      }),
      getUserAttributes: ({
        firstname,
        subscription,
        roles,
        avatar,
      }: {
        firstname?: string;
        subscription?: string;
        roles?: string[];
        avatar?: string;
      }) => ({
        name: firstname,
        subscription,
        roles,
        avatar,
      }),
    });

    return lucia;
  } catch (error) {
    throw new Error(
      `Failed to initialize Lucia, error: ${(error as Error).message}`
    );
  }
};

/**
 * Pre-initialized Lucia instance for immediate use.
 */
export const auth: Lucia = await initializeLucia();
export default auth;

/**
 * Extend Lucia types to include custom user and session attributes.
 */
declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      first_name?: string;
      subscription?: string;
      roles?: string[];
      avatar?: string;
    };
    DatabaseSessionAttributes: {
      country?: string;
    };
  }
}
