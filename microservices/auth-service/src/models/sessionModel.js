/**
 * @file sessionModel.js
 * @description MongoDB connection and session collection management
 * @module sessionDb
 */

import { MongoClient, ObjectId } from "mongodb";

const DATABASE_NAME = process.env.DATABASE_NAME;
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

// Define the session collection schema
const sessionSchema = {
  bsonType: "object",
  required: ["_id", "user_id", "expires_at"],
  properties: {
    _id: {
      bsonType: "string",
      description: "Must be a string and is required.",
      uniqueItems: true,
    },
    user_id: {
      bsonType: "string",
      description: "Must be a string and is required.",
      uniqueItems: true,
    },
    expires_at: {
      bsonType: "Date",
      description: "Must be a date and is required.",
    },
  },
};

/**
 * Connect to MongoDB.
 * @returns {Promise<Db>} The MongoDB database instance.
 * @throws {Error} If the connection fails.
 */
const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(DATABASE_NAME);
    console.log(`Connected to database: ${DATABASE_NAME}`);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

/**
 * Check and create the session collection if it doesn't exist.
 * @returns {Promise<Collection>} The created or existing collection.
 * @throws {Error} If there's an error checking or creating the collection.
 */
const createSessionCollection = async () => {
  try {
    const collections = await db.listCollections({ name: "session" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("session", {
        validator: { $jsonSchema: sessionSchema },
      });
      console.log("Collection created!");
    } else {
      console.log("Collection already exists.");
    }
  } catch (error) {
    console.error("Error checking or creating collection:", error);
    throw error;
  }
};

/**
 * List all collections in the database.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error listing collections.
 */
const listCollections = async () => {
  try {
    const collections = await db.listCollections().toArray();
    console.log(
      "Registered collections:",
      collections.map((col) => col.name),
    );
  } catch (error) {
    console.error("Error listing collections:", error);
  }
};

/**
 * Session operations object
 * @type {Object}
 */
export const Session = {
  /**
   * Create a new session entry.
   * @param {Object} sessionData - The session data.
   * @returns {Promise<InsertOneResult>} The result of the insert operation.
   */
  create(sessionData) {
    sessionData.createdAt = sessionData.createdAt || new Date();
    sessionData.lastAccessed = sessionData.lastAccessed || new Date();
    return db.collection("session").insertOne(sessionData);
  },

  /**
   * Find a session by its ID.
   * @param {string} sessionId - The session ID.
   * @returns {Promise<Object|null>} The found session, or null if not found.
   */
  findById(sessionId) {
    return db.collection("session").findOne({ _id: sessionId });
  },

  /**
   * Update the last accessed timestamp for a specific session.
   * @param {string} sessionId - The session ID.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  updateLastAccessed(sessionId) {
    return db
      .collection("session")
      .updateOne({ _id: sessionId }, { $set: { lastAccessed: new Date() } });
  },

  // Add more methods as needed
};

/**
 * Initialize the database connection and setup collections.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error initializing the database.
 */
const initializeDatabase = async () => {
  await connectToMongoDB();
  await createSessionCollection();
  await listCollections();
};

// Initialize the database
initializeDatabase()
  .then(() => {
    console.log("Database initialization completed.");
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
  });

export default Session;
