/**
 * @file lucia-config.ts
 * @module lucia-config
 * 
 * @description
 * This module connects to a MongoDB database and initializes the Lucia authentication system.
 * It configures the MongoDB adapter with session, user, and OAuth account collections.
 * It also sets session cookie security based on the environment and maps user/session attributes.
 * 
 * @usage
 * - Import this module to get the initialized Lucia instance for authentication.
 * - Ensure environment variables `DATABASE_NAME` and `NODE_ENV` are set correctly.
 * 
 * @notes
 * - Uses the MongoDB service hostname: "mongodb-service".
 * - Session cookies are secure only in production.
 * - Collections used: "session", "users", and "oauthAccount".
 * 
 * @requires mongodb
 * @requires @lucia-auth/adapter-mongodb
 * @requires lucia
 */

import { MongoClient, Db } from "mongodb";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia } from "lucia";

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
      db.collection("session"),
      db.collection("users"),
    );

    // Attach OAuth account collection to adapter
    (adapter as any).OauthAccount = db.collection("oauthAccount");

    // Initialize Lucia with adapter and session/user attribute mapping
    const lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "lax", // Prevent cross-site request forgery on unsafe requests
        },
      },
      getSessionAttributes: ({ country }: { country?: string }) => ({ country }),
      getUserAttributes: ({
        first_name,
        subscription,
        roles,
        avatar,
      }: {
        first_name?: string;
        subscription?: string;
        roles?: string[];
        avatar?: string;
      }) => ({
        name: first_name,
        subscription,
        roles,
        avatar,
      }),
    });

    return lucia;
  } catch (error) {
    console.error("Error initializing Lucia:", error);
    throw new Error("Failed to initialize Lucia");
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
declare module "lucia" {
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
