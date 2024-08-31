// lucia-setup.js

/**
 * MongoDB and Lucia Authentication Initialization
 *
 * This module connects to a MongoDB database and initializes the Lucia authentication system
 * with the necessary configurations, including session and user collections.
 *
 * @module lucia-setup
 * @requires mongodb
 * @requires @lucia-auth/adapter-mongodb
 * @requires ../models/oauthAccountModel.js
 * @requires ../models/sessionModel.js
 * @requires lucia
 */

import { MongoClient } from "mongodb";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia, TimeSpan } from "lucia";

const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_URL = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

/**
 * Connects to MongoDB and initializes the Lucia authentication system.
 *
 * @returns {Promise<Lucia>} Initialized Lucia instance.
 * @throws {Error} Throws an error if the MongoDB connection or Lucia initialization fails.
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

    // Assign OauthAccount collection to the adapter
    adapter.OauthAccount = db.collection("oauthAccount");

    // Initialize the Lucia authentication system
    const lucia = new Lucia(adapter, {
      expires: false,
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        },
      },
      getSessionAttributes: ({ country }) => ({ country }),
      getUserAttributes: ({ _id, name, roles }) => ({
        userId: _id,
        username: name,
        roles,
      }),
    });

    return lucia;
  } catch (error) {
    console.error("Error initializing Lucia:", error);
    throw new Error("Failed to initialize Lucia");
  }
};

// Export the initialized Lucia instance
export const lucia = await initializeLucia();
export default lucia;
