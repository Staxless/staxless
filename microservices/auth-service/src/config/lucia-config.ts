/**
 * @file lucia-config.ts
 * @description Initializes the Lucia authentication system with the shared MongoDB database.
 */

import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Lucia } from 'lucia';
import type { Collection, Db } from 'mongodb';
import { database } from './db-config.js';

// Extend MongodbAdapter to include OauthAccount and MagicLink properties
interface CustomMongodbAdapter extends MongodbAdapter {
  OauthAccount: Collection;
  MagicLink: Collection;
}

/**
 * Initializes the Lucia authentication system.
 * @returns {Promise<Lucia>} The initialized Lucia instance.
 * @throws {Error} If Lucia initialization fails.
 */
export async function initializeLucia(): Promise<Lucia> {
  try {
    const db: Db = await database.getClient(); // Await the Promise to get the Db instance
    const adapter = new MongodbAdapter(
      db.collection('session'),
      db.collection('users')
    ) as CustomMongodbAdapter;

    adapter.OauthAccount = db.collection('oauthAccount');
    adapter.MagicLink = db.collection('magicLinks');

    const lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          domain: process.env.COOKIE_DOMAIN || undefined,
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
    throw new Error(`Failed to initialize Lucia: ${(error as Error).message}`);
  }
}

// Export auth as a variable to set after DB initialization
export const auth: Lucia = await initializeLucia();

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

export default auth;
