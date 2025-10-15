/**
 * @file magic-link-model.ts
 * @description Manages the MongoDB schema and operations for magic link tokens using the shared database service.
 */

import type { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { database } from '../config/db-config';

interface MagicLinkSchema {
  _id?: ObjectId;
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
}

const magicLinkSchema = {
  bsonType: 'object',
  required: ['token', 'user_id', 'expires_at', 'created_at'],
  properties: {
    _id: { bsonType: ['objectId', 'null'] },
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

// Static reference to the initialized collection
let collection: Collection | null = null;

/**
 * Initializes the magicLinks collection with schema validation.
 * @returns {Promise<Collection>} The magicLinks collection.
 */
export const initializeCollection = async (): Promise<Collection> => {
  if (collection) {
    return collection; // Return cached collection if already initialized
  }

  try {
    const db = database.getClient(); // Triggers connect() if not connected
    const collections = await db
      .listCollections({ name: 'magicLinks' })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection('magicLinks', {
        validator: { $jsonSchema: magicLinkSchema },
      });
    }
    collection = db.collection('magicLinks');
    return collection || Promise.reject('Failed to get magicLinks collection');
  } catch (error) {
    throw new Error(
      `Failed to initialize magicLinks collection: ${error.message}`
    );
  }
};

export const MagicLink = {
  async create(magicLinkData: MagicLinkSchema): Promise<InsertOneResult> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.insertOne(magicLinkData);
  },

  async findByToken(token: string): Promise<MagicLinkSchema | null> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.findOne({ token });
  },

  async delete(token: string): Promise<void> {
    const coll = await initializeCollection(); // Lazy initialization
    await coll.deleteOne({ token });
  },
};

export default MagicLink;
