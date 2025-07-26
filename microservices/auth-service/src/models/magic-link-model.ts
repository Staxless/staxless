/**
 * @file magicLinkModel.ts
 * @description Manages the MongoDB schema and operations for magic link tokens in the auth service.
 *
 * @module MagicLinkModel
 * @see MongoDB, Node.js
 *
 * @functions
 * - connectToMongoDB: Establishes a MongoDB connection.
 * - createMagicLinksCollection: Initializes the 'magicLinks' collection with schema validation.
 * - listCollections: Logs existing collections in the database.
 * - MagicLink.create: Inserts a new magic link token.
 * - MagicLink.findByToken: Finds a magic link by its token.
 * - MagicLink.delete: Deletes a magic link by its token.
 * - initializeDatabase: Orchestrates initial DB connection and setup.
 */

import {
  type Collection,
  type Db,
  type InsertOneResult,
  MongoClient,
  type ObjectId,
} from 'mongodb';

const DATABASE_NAME = process.env.DATABASE_NAME || 'auth_db';
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db: Db;

// Define the magic link collection schema
interface MagicLinkSchema {
  _id?: ObjectId; // Added to account for MongoDB's automatic _id field
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
}

const magicLinkSchema = {
  bsonType: 'object',
  required: ['token', 'user_id', 'expires_at', 'created_at'],
  properties: {
    _id: { bsonType: ['objectId', 'null'] }, // Allow _id to be optional in schema
    token: {
      bsonType: 'string',
      description: 'Must be a string and is required.',
    },
    user_id: {
      bsonType: 'string',
      description: 'Must be a string and is required.',
    },
    expires_at: {
      bsonType: 'date',
      description: 'Must be a date and is required.',
    },
    created_at: {
      bsonType: 'date',
      description: 'Must be a date and is required.',
    },
  },
};

/**
 * Connect to MongoDB.
 * @returns {Promise<Db>} The MongoDB database instance.
 * @throws {Error} If the connection fails.
 */
const connectToMongoDB = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(url);
    db = client.db(DATABASE_NAME);
    return db;
  } catch (_error) {
    throw new Error('Failed to connect to MongoDB');
  }
};

/**
 * Check and create the magic link collection if it doesn't exist.
 * @returns {Promise<Collection>} The created or existing collection.
 * @throws {Error} If there's an error checking or creating the collection.
 */
const createMagicLinksCollection = async (): Promise<Collection> => {
  try {
    const collections = await db
      .listCollections({ name: 'magicLinks' })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection('magicLinks', {
        validator: { $jsonSchema: magicLinkSchema },
      });
    }
    return db.collection('magicLinks');
  } catch (error) {
    throw new Error(
      `Failed to create or access magicLinks collection: ${(error as Error).message}`
    );
  }
};

/**
 * List all collections in the database.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error listing collections.
 */
const listCollections = async (): Promise<void> => {
  try {
    const _collections = await db.listCollections().toArray();
    // Optionally log collections in development
    // Replace with proper logging in production
  } catch (error) {
    throw new Error(`Failed to list collections: ${(error as Error).message}`);
  }
};

/**
 * Magic Link operations object
 */
export const MagicLink = {
  /**
   * Create a new magic link entry.
   * @param {MagicLinkSchema} magicLinkData - The magic link data.
   * @returns {Promise<InsertOneResult>} The result of the insert operation.
   */
  create(magicLinkData: MagicLinkSchema): Promise<InsertOneResult> {
    return db.collection('magicLinks').insertOne(magicLinkData);
  },

  /**
   * Find a magic link by its token.
   * @param {string} token - The magic link token.
   * @returns {Promise<MagicLinkSchema | null>} The found magic link, or null if not found.
   */
  findByToken(token: string): Promise<MagicLinkSchema | null> {
    return db.collection('magicLinks').findOne({ token });
  },

  /**
   * Delete a magic link by its token.
   * @param {string} token - The magic link token.
   * @returns {Promise<void>}
   */
  async delete(token: string): Promise<void> {
    await db.collection('magicLinks').deleteOne({ token });
  },
};

/**
 * Initialize the database connection and setup collections.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error initializing the database.
 */
const initializeDatabase = async (): Promise<void> => {
  await connectToMongoDB();
  await createMagicLinksCollection();
  await listCollections();
};

// Initialize the database
initializeDatabase().catch((error) => {
  throw new Error(`Database initialization failed: ${error.message}`);
});

export default MagicLink;
