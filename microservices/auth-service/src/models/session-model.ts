/**
 * @file session-model.ts
 * @description Manages the MongoDB session collection operations using the shared database service.
 */

import type { Collection, InsertOneResult, UpdateResult } from 'mongodb';
import { database } from '../config/db-config.js';

interface SessionSchema {
  _id: string;
  user_id: string;
  expires_at: Date;
  createdAt?: Date;
  lastAccessed?: Date;
}

const sessionSchemaValidator = {
  bsonType: 'object',
  required: ['_id', 'user_id', 'expires_at'],
  properties: {
    _id: { bsonType: 'string', description: 'Session ID' },
    user_id: { bsonType: 'string', description: 'User ID' },
    expires_at: { bsonType: 'date', description: 'Expiration date' },
    createdAt: { bsonType: 'date', description: 'Creation timestamp' },
    lastAccessed: { bsonType: 'date', description: 'Last accessed timestamp' },
  },
};

// Static reference to the initialized collection
let collection: Collection<SessionSchema> | undefined;

/**
 * Initializes the session collection with schema validation.
 * @returns {Promise<Collection<SessionSchema>>} The session collection.
 */
export const initializeCollection = async (): Promise<
  Collection<SessionSchema>
> => {
  try {
    const db = database.getClient(); // Triggers connect() if not connected
    const collections = await db.listCollections({ name: 'session' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('session', {
        validator: { $jsonSchema: sessionSchemaValidator },
      });
    }
    collection = db.collection('session');
    return collection || Promise.reject('Failed to get session collection');
  } catch (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : String(error);
    throw new Error(`Failed to initialize session collection: ${errorMessage}`);
  }
};

export const Session = {
  async create(
    sessionData: SessionSchema
  ): Promise<InsertOneResult<SessionSchema>> {
    const coll = await initializeCollection(); // Lazy initialization
    sessionData.createdAt ??= new Date();
    sessionData.lastAccessed ??= new Date();
    return await coll.insertOne(sessionData);
  },

  async findById(sessionId: string): Promise<SessionSchema | null> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.findOne({ _id: sessionId });
  },

  async updateLastAccessed(sessionId: string): Promise<UpdateResult> {
    const coll = await initializeCollection(); // Lazy initialization
    return await coll.updateOne(
      { _id: sessionId },
      { $set: { lastAccessed: new Date() } }
    );
  },
};

export default Session;
