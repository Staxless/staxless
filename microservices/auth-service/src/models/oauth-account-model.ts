/**
 * @file oauth-account-model.ts
 * @description Manages the MongoDB schema and operations for OAuth accounts using the shared database service.
 */

import {
  type Collection,
  type InsertOneResult,
  ObjectId,
  type UpdateResult,
} from 'mongodb';
import { database } from '../config/db-config';

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

// Static reference to the initialized collection
let collection: Collection | null = null;

/**
 * Initializes the oauthAccount collection with schema validation.
 * @returns {Promise<Collection>} The oauthAccount collection.
 */
export const initializeCollection = async (): Promise<Collection> => {
  if (collection) {
    return collection; // Return cached collection if already initialized
  }

  try {
    const db = database.getClient(); // Triggers connect() if not connected
    const collections = await db
      .listCollections({ name: 'oauthAccount' })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection('oauthAccount', {
        validator: { $jsonSchema: oauthAccountSchema },
      });
    }
    collection = db.collection('oauthAccount');
    return collection;
  } catch (error) {
    throw new Error(
      `Failed to initialize oauthAccount collection: ${error.message}`
    );
  }
};

export const OauthAccount = {
  async create(oauthAccountData: OauthAccountSchema): Promise<InsertOneResult> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.insertOne(oauthAccountData);
  },

  async findById(oauthAccountId: string): Promise<OauthAccountSchema | null> {
    const coll = await initializeCollection(); // Lazy initialization
    return (await coll.findOne({
      _id: new ObjectId(oauthAccountId),
    })) as Promise<OauthAccountSchema | null>;
  },

  async findByProvider(
    provider_id: string,
    provider_user_id: string
  ): Promise<OauthAccountSchema | null> {
    const coll = await initializeCollection(); // Lazy initialization
    return (await coll.findOne({
      provider_id,
      provider_user_id,
    })) as Promise<OauthAccountSchema | null>;
  },

  async updateProviderUserId(
    provider_id: string,
    provider_user_id: string,
    newProviderUserId: string
  ): Promise<UpdateResult> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.updateOne(
      { provider_id, provider_user_id },
      { $set: { provider_user_id: newProviderUserId } }
    );
  },
};

export default OauthAccount;
