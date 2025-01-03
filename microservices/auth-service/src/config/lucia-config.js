// lucia-setup.js

/**
 * Module for MongoDB and Lucia Authentication Initialization
 *
 * This module connects to a MongoDB database and initializes the Lucia authentication system.
 * It sets up the necessary configurations, including session and user collections,
 * and integrates an OAuth account collection.
 *
 * Usage:
 * - Import this module to use the initialized Lucia instance.
 * - Ensure environment variables DATABASE_NAME and NODE_ENV are correctly set.
 *
 * Key Notes:
 * - MongoDB connection URL uses a service hostname ("mongodb-service").
 * - Session cookies are configured to be secure in production.
 * - The adapter uses three MongoDB collections: "session", "user", and "oauthAccount".
 *
 * @module lucia-setup
 * @requires mongodb
 * @requires @lucia-auth/adapter-mongodb
 * @requires lucia
 * @requires ../models/oauthAccountModel.js
 * @requires ../models/sessionModel.js
 */

import { MongoClient } from "mongodb";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia } from "lucia";

const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_URL = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

/**
 * Connects to MongoDB and initializes the Lucia authentication system.
 *
 * @async
 * @function initializeLucia
 * @returns {Promise<Lucia>} The initialized Lucia instance.
 * @throws {Error} Throws an error if MongoDB connection or Lucia initialization fails.
 *
 * Key Edge Cases:
 * - MongoDB connection issues will result in a thrown error.
 * - Ensure collection names ("session", "user", "oauthAccount") exist in the database.
 */
export const initializeLucia = async () => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    });
    db = client.db(DATABASE_NAME);

    // Initialize the MongoDB adapter with session and user collections
    const adapter = new MongodbAdapter(
      db.collection("session"),
      db.collection("user"),
    );

    // Assign OAuthAccount collection to the adapter
    adapter.OauthAccount = db.collection("oauthAccount");

    // Initialize the Lucia authentication system
    const lucia = new Lucia(adapter, {
      expires: false, // Disable session expiration
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === "production", // Secure cookies in production
          sameSite: "Lax", // Prevent cross-site requests except top-level navigation
        },
      },
      getSessionAttributes: ({ country }) => ({ country }), // Add country to session attributes
      getUserAttributes: ({ first_name, subscription, roles, avatar }) => ({
        name: first_name,
        subscription,
        roles,
        avatar,
      }), // Map user attributes
    });

    return lucia;
  } catch (error) {
    console.error("Error initializing Lucia:", error);
    throw new Error("Failed to initialize Lucia");
  }
};

// Export the initialized Lucia instance
export const lucia = await initializeLucia(); // Pre-initialize for immediate use
export default lucia;
