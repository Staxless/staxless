import { MongoClient } from "mongodb";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia } from "lucia";

const DATABASE_NAME = process.env.DATABASE_NAME;
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

/**
 * Connects to MongoDB and initializes the Lucia authentication system.
 *
 * @returns {Lucia} Initialized Lucia instance.
 */
export const initializeLucia = async () => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url, {});
    db = client.db(DATABASE_NAME);

    // Initialize the MongoDB adapter with session and user collections
    const adapter = new MongodbAdapter(
      db.collection("session"),
      db.collection("users"),
    );

    // Initialize the Lucia authentication system
    const lucia = new Lucia(adapter, {
      expires: false,
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === "production",
        },
      },
      getSessionAttributes: ({ country }) => ({ country }),
      getUserAttributes: ({ user_id, username }) => ({
        userId: user_id,
        username,
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
