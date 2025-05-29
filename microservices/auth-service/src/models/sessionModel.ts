/**
 * @file sessionModel.ts
 * @description Manages the MongoDB connection and session collection operations.
 * Used for creating, retrieving, and updating user sessions.
 * 
 * @module Session
 * 
 * @functions
 * - connectToMongoDB: Connects to the MongoDB database.
 * - createSessionCollection: Ensures the session collection exists and validates documents.
 * - listCollections: Logs all collections in the current database.
 * - Session.create: Creates a new session document.
 * - Session.findById: Retrieves a session by its ID.
 * - Session.updateLastAccessed: Updates the lastAccessed timestamp for a session.
 * - initializeDatabase: Bootstraps the connection and collection setup.
 */

import { MongoClient, ObjectId, Db, Collection, InsertOneResult, UpdateResult } from "mongodb";

// Constants
const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_URL = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
const SESSION_COLLECTION_NAME = "session";

// MongoDB client and database instance
let db: Db;
let sessionCollection: Collection<SessionSchema>;

/**
 * Interface representing the session schema.
 */
interface SessionSchema {
  _id: string;
  user_id: string;
  expires_at: Date;
  createdAt?: Date;
  lastAccessed?: Date;
}

// JSON Schema for MongoDB validator
const sessionSchemaValidator = {
  bsonType: "object",
  required: ["_id", "user_id", "expires_at"],
  properties: {
    _id: { bsonType: "string", description: "Session ID", uniqueItems: true },
    user_id: { bsonType: "string", description: "User ID", uniqueItems: true },
    expires_at: { bsonType: "date", description: "Expiration date" },
    createdAt: { bsonType: "date", description: "Creation timestamp" },
    lastAccessed: { bsonType: "date", description: "Last accessed timestamp" },
  },
};

/**
 * Connects to MongoDB and returns the database instance.
 * @returns {Promise<Db>} The MongoDB database instance.
 * @throws {Error} If connection fails.
 */
const connectToMongoDB = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = client.db(DATABASE_NAME);
    console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

/**
 * Ensures the session collection exists with schema validation.
 * @returns {Promise<Collection<SessionSchema>>} The session collection.
 * @throws {Error} If creation fails.
 */
const createSessionCollection = async (): Promise<Collection<SessionSchema>> => {
  try {
    const collections = await db.listCollections({ name: SESSION_COLLECTION_NAME }).toArray();
    if (collections.length === 0) {
      await db.createCollection(SESSION_COLLECTION_NAME, {
        validator: { $jsonSchema: sessionSchemaValidator },
      });
      console.log("Session collection created.");
    } else {
      console.log("Session collection already exists.");
    }
    sessionCollection = db.collection<SessionSchema>(SESSION_COLLECTION_NAME);
    return sessionCollection;
  } catch (error) {
    console.error("Error creating session collection:", error);
    throw error;
  }
};

/**
 * Lists all collections in the database for debugging purposes.
 * @returns {Promise<void>}
 */
const listCollections = async (): Promise<void> => {
  try {
    const collections = await db.listCollections().toArray();
    console.log("Collections in database:", collections.map((col) => col.name));
  } catch (error) {
    console.error("Error listing collections:", error);
  }
};

/**
 * Session operations for create, find, and update.
 */
export const Session = {
  /**
   * Creates a new session entry in the database.
   * @param {SessionSchema} sessionData - The session object to store.
   * @returns {Promise<InsertOneResult<SessionSchema>>} Insert result from MongoDB.
   */
  async create(sessionData: SessionSchema): Promise<InsertOneResult<SessionSchema>> {
    sessionData.createdAt ??= new Date();
    sessionData.lastAccessed ??= new Date();
    return sessionCollection.insertOne(sessionData);
  },

  /**
   * Finds a session by its session ID.
   * @param {string} sessionId - The session ID to search for.
   * @returns {Promise<SessionSchema | null>} The found session or null if not found.
   */
  async findById(sessionId: string): Promise<SessionSchema | null> {
    return sessionCollection.findOne({ _id: sessionId });
  },

  /**
   * Updates the last accessed timestamp of a session.
   * @param {string} sessionId - The session ID to update.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateLastAccessed(sessionId: string): Promise<UpdateResult> {
    return sessionCollection.updateOne(
      { _id: sessionId },
      { $set: { lastAccessed: new Date() } }
    );
  },
};

/**
 * Initializes the database and session collection.
 * @returns {Promise<void>}
 * @throws {Error} If initialization fails.
 */
const initializeDatabase = async (): Promise<void> => {
  await connectToMongoDB();
  await createSessionCollection();
  await listCollections();
};

// Start initialization
initializeDatabase()
  .then(() => console.log("MongoDB session model initialized."))
  .catch((error) => console.error("Failed to initialize MongoDB session model:", error));

export default Session;
