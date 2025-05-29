/**
 * @file oauthAccountModel.ts
 * @description Manages the MongoDB schema and operations for OAuth accounts in the auth service.
 *              This includes mapping external OAuth provider accounts to internal user accounts.
 * 
 * @module OauthAccountModel
 * @see MongoDB, Node.js
 * 
 * @functions
 * - connectToMongoDB: Establishes a MongoDB connection.
 * - createUsersCollection: Initializes the 'oauthAccount' collection with schema validation.
 * - listCollections: Logs existing collections in the database.
 * - OauthAccount.create: Inserts a new OAuth account.
 * - OauthAccount.findById: Finds an OAuth account by its MongoDB ObjectId.
 * - OauthAccount.findByProvider: Retrieves an OAuth account by provider/user IDs.
 * - OauthAccount.updateProviderUserId: Updates a provider user ID for an existing account.
 * - initializeDatabase: Orchestrates initial DB connection and setup.
 */

import { MongoClient, ObjectId, Db, Collection, InsertOneResult, UpdateResult } from "mongodb";

const DATABASE_NAME = process.env.DATABASE_NAME;
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db: Db;

// Define the OAuth account collection schema
interface OauthAccountSchema {
  provider_id: string;
  provider_user_id: string;
  user_id: string;
}

const oauthAccountSchema = {
  bsonType: "object",
  required: ["provider_id", "provider_user_id", "user_id"],
  properties: {
    provider_id: { bsonType: "string", description: "Must be a string and is required." },
    provider_user_id: { bsonType: "string", description: "Must be a string and is required." },
    user_id: { bsonType: "string", description: "Must be a string and is required." },
  },
};

/**
 * Connect to MongoDB.
 * @returns {Promise<Db>} The MongoDB database instance.
 * @throws {Error} If the connection fails.
 */
const connectToMongoDB = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any); // `as any` to handle deprecated options in TypeScript
    db = client.db(DATABASE_NAME);
    console.log(`Connected to database: ${DATABASE_NAME}`);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

/**
 * Check and create the OAuth account collection if it doesn't exist.
 * @returns {Promise<Collection>} The created or existing collection.
 * @throws {Error} If there's an error checking or creating the collection.
 */
const createUsersCollection = async (): Promise<Collection> => {
  try {
    const collections = await db.listCollections({ name: "oauthAccount" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("oauthAccount", {
        validator: { $jsonSchema: oauthAccountSchema },
      });
      console.log("Collection created!");
    } else {
      console.log("Collection already exists.");
    }
    return db.collection("oauthAccount");
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
const listCollections = async (): Promise<void> => {
  try {
    const collections = await db.listCollections().toArray();
    console.log("Registered collections:", collections.map((col) => col.name));
  } catch (error) {
    console.error("Error listing collections:", error);
  }
};

/**
 * OAuth Account operations object
 */
export const OauthAccount = {
  /**
   * Create a new OAuth account entry.
   * @param {OauthAccountSchema} oauthAccountData - The OAuth account data.
   * @returns {Promise<InsertOneResult>} The result of the insert operation.
   */
  async create(oauthAccountData: OauthAccountSchema): Promise<InsertOneResult> {
    return db.collection("oauthAccount").insertOne(oauthAccountData);
  },

  /**
   * Find an OAuth account by its ID.
   * @param {string} oauthAccountId - The OAuth account ID.
   * @returns {Promise<OauthAccountSchema | null>} The found OAuth account, or null if not found.
   */
  async findById(oauthAccountId: string): Promise<OauthAccountSchema | null> {
    return db.collection("oauthAccount").findOne({ _id: new ObjectId(oauthAccountId) });
  },

  /**
   * Find an OAuth account by provider and user IDs.
   * @param {string} provider_id - The provider ID.
   * @param {string} provider_user_id - The provider user ID.
   * @returns {Promise<OauthAccountSchema | null>} The found OAuth account, or null if not found.
   */
  async findByProvider(provider_id: string, provider_user_id: string): Promise<OauthAccountSchema | null> {
    return db.collection("oauthAccount").findOne({ provider_id, provider_user_id });
  },

  /**
   * Update the provider user ID for a specific OAuth account.
   * @param {string} provider_id - The provider ID.
   * @param {string} provider_user_id - The existing provider user ID.
   * @param {string} newProviderUserId - The new provider user ID.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateProviderUserId(
    provider_id: string,
    provider_user_id: string,
    newProviderUserId: string
  ): Promise<UpdateResult> {
    return db
      .collection("oauthAccount")
      .updateOne({ provider_id, provider_user_id }, { $set: { provider_user_id: newProviderUserId } });
  },
};

/**
 * Initialize the database connection and setup collections.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error initializing the database.
 */
const initializeDatabase = async (): Promise<void> => {
  await connectToMongoDB();
  await createUsersCollection();
  await listCollections();
};

// Initialize the database
initializeDatabase()
  .then(() => console.log("Database initialization completed."))
  .catch((error) => console.error("Database initialization failed:", error));

export default OauthAccount;
