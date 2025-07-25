/**
 * @file oauth-account-model.ts
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

import {
  type Collection,
  type Db,
  type InsertOneResult,
  MongoClient,
  ObjectId,
  type UpdateResult,
} from 'mongodb';

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
  bsonType: 'object',
  required: ['provider_id', 'provider_user_id', 'user_id'],
  properties: {
    provider_id: {
      bsonType: 'string',
      description: 'Must be a string and is required.',
    },
    provider_user_id: {
      bsonType: 'string',
      description: 'Must be a string and is required.',
    },
    user_id: {
      bsonType: 'string',
      description: 'Must be a string and is required.',
    },
  },
};

const connectToMongoDB = async (): Promise<Db> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as Record<string, unknown>); // Avoid 'any' type
  db = client.db(DATABASE_NAME);
  return db;
};

const createUsersCollection = async (): Promise<Collection> => {
  const collections = await db
    .listCollections({ name: 'oauthAccount' })
    .toArray();
  if (collections.length === 0) {
    await db.createCollection('oauthAccount', {
      validator: { $jsonSchema: oauthAccountSchema },
    });
  } else {
    // Collection already exists; nothing to do here
  }
  return db.collection('oauthAccount');
};

const listCollections = async (): Promise<void> => {
  try {
    const _collections = await db.listCollections().toArray();
    // Example: log collection names for debugging
    // console.log(_collections.map(col => col.name));
  } catch (_error) {
    // Intentionally ignored
  }
};

export const OauthAccount = {
  create(oauthAccountData: OauthAccountSchema): Promise<InsertOneResult> {
    return db.collection('oauthAccount').insertOne(oauthAccountData);
  },
  findById(oauthAccountId: string): Promise<OauthAccountSchema | null> {
    return db.collection('oauthAccount').findOne({
      _id: new ObjectId(oauthAccountId),
    }) as Promise<OauthAccountSchema | null>;
  },
  findByProvider(
    provider_id: string,
    provider_user_id: string
  ): Promise<OauthAccountSchema | null> {
    return db.collection('oauthAccount').findOne({
      provider_id,
      provider_user_id,
    }) as Promise<OauthAccountSchema | null>;
  },
  updateProviderUserId(
    provider_id: string,
    provider_user_id: string,
    newProviderUserId: string
  ): Promise<UpdateResult> {
    return db
      .collection('oauthAccount')
      .updateOne(
        { provider_id, provider_user_id },
        { $set: { provider_user_id: newProviderUserId } }
      );
  },
};

const initializeDatabase = async (): Promise<void> => {
  await connectToMongoDB();
  await createUsersCollection();
  await listCollections();
};

// Initialize the database
initializeDatabase()
  .then(() => {
    // Initialization successful
  })
  .catch((_error) => {
    // Intentionally ignored
  });

export default OauthAccount;
