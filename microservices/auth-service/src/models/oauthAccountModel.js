/**
 * @file MongoDB connection and OAuth account collection management
 * @description This module handles the connection to MongoDB, manages the OAuth account collection schema, and provides methods for interacting with the OAuth account data.
 * @module db
 */

import { MongoClient, ObjectId } from "mongodb";

const DATABASE_NAME = process.env.DATABASE_NAME;
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

// Define the OAuth account collection schema
const oauthAccountSchema = {
  bsonType: "object",
  required: ["provider_id", "provider_user_id", "user_id"],
  properties: {
    provider_id: {
      bsonType: "string",
      description: "Must be a string and is required.",
    },
    provider_user_id: {
      bsonType: "string",
      description: "Must be a string and is required.",
    },
    user_id: {
      bsonType: "string",
      description: "Must be a string and is required.",
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
 * Check and create the OAuth account collection if it doesn't exist.
 * @returns {Promise<Collection>} The created or existing collection.
 * @throws {Error} If there's an error checking or creating the collection.
 */
const createUsersCollection = async () => {
  try {
    const collections = await db
      .listCollections({ name: "oauthAccount" })
      .toArray();
    if (collections.length === 0) {
      // Collection does not exist, create it with validation
      await db.createCollection("oauthAccount", {
        validator: { $jsonSchema: oauthAccountSchema },
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

export const OauthAccount = {
  /**
   * Create a new OAuth account entry.
   * @param {Object} oauthAccountData - The OAuth account data.
   * @returns {Promise<InsertOneResult>} The result of the insert operation.
   */
  create(oauthAccountData) {
    return db.collection("oauthAccount").insertOne(oauthAccountData);
  },

  /**
   * Find an OAuth account by its ID.
   * @param {string} oauthAccountId - The OAuth account ID.
   * @returns {Promise<Object|null>} The found OAuth account, or null if not found.
   */
  findById(oauthAccountId) {
    return db
      .collection("oauthAccount")
      .findOne({ _id: new ObjectId(oauthAccountId) });
  },

  /**
   * Find an OAuth account by provider and user IDs.
   * @param {string} provider_id - The provider ID.
   * @param {string} provider_user_id - The provider user ID.
   * @returns {Promise<Object|null>} The found OAuth account, or null if not found.
   */
  findByProvider(provider_id, provider_user_id) {
    return db
      .collection("oauthAccount")
      .findOne({ provider_id, provider_user_id });
  },

  /**
   * Update the provider user ID for a specific OAuth account.
   * @param {string} provider_id - The provider ID.
   * @param {string} provider_user_id - The existing provider user ID.
   * @param {string} newProviderUserId - The new provider user ID.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  updateProviderUserId(provider_id, provider_user_id, newProviderUserId) {
    return db
      .collection("oauthAccount")
      .updateOne(
        { provider_id, provider_user_id },
        { $set: { provider_user_id: newProviderUserId } },
      );
  },
};

/**
 * Initialize the database connection and setup collections.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error initializing the database.
 */
const initializeDatabase = async () => {
  await connectToMongoDB();
  await createUsersCollection();
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

export default OauthAccount;
