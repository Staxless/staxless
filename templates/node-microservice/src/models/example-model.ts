/**
 * @file models/example-model.ts
 * @description Example model demonstrating MongoDB collection pattern.
 * Replace with your own models.
 */

import type { Collection, Db, WithId } from 'mongodb';
import { database } from '../config/db-config.js';

/**
 * Example document type
 */
export interface ExampleType {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at?: Date;
}

/**
 * MongoDB JSON Schema for validation
 */
const exampleSchema = {
  bsonType: 'object',
  required: ['_id', 'name', 'status', 'created_at'],
  properties: {
    _id: { bsonType: 'string' },
    name: { bsonType: 'string', minLength: 1 },
    description: { bsonType: ['string', 'null'] },
    status: { enum: ['active', 'inactive'] },
    created_at: { bsonType: 'date' },
    updated_at: { bsonType: ['date', 'null'] },
  },
};

let cachedCollection: Collection<ExampleType> | null = null;
let isInitializing = false;
let initializationPromise: Promise<Collection<ExampleType>> | null = null;

/**
 * Gets or creates the examples collection with schema validation
 */
const getCollection = async (): Promise<Collection<ExampleType>> => {
  if (cachedCollection) return cachedCollection;
  if (isInitializing && initializationPromise) return await initializationPromise;

  isInitializing = true;
  initializationPromise = (async () => {
    try {
      const db: Db = await database.getClient();
      const collections = await db.listCollections({ name: 'examples' }).toArray();

      if (collections.length === 0) {
        console.log('Creating examples collection with schema validation...');
        await db.createCollection('examples', {
          validator: { $jsonSchema: exampleSchema },
        });
      }

      const collection = db.collection<ExampleType>('examples');
      cachedCollection = collection;
      isInitializing = false;
      return collection;
    } catch (error) {
      isInitializing = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return await initializationPromise;
};

/**
 * Example model with CRUD operations
 */
export const Example = {
  /**
   * Create a new example document
   */
  async create(data: Omit<ExampleType, '_id' | 'created_at'> & { _id?: string }) {
    const collection = await getCollection();
    const doc: ExampleType = {
      _id: data._id || crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: data.status,
      created_at: new Date(),
    };
    await collection.insertOne(doc);
    return doc;
  },

  /**
   * Find one document by ID
   */
  async findOne(query: { _id: string }): Promise<WithId<ExampleType> | null> {
    const collection = await getCollection();
    return collection.findOne(query);
  },

  /**
   * Find all documents matching filter
   */
  async find(filter: Partial<ExampleType> = {}): Promise<WithId<ExampleType>[]> {
    const collection = await getCollection();
    return collection.find(filter).toArray();
  },

  /**
   * Update a document by ID
   */
  async update(id: string, data: Partial<ExampleType>) {
    const collection = await getCollection();
    return collection.updateOne(
      { _id: id },
      { $set: { ...data, updated_at: new Date() } }
    );
  },

  /**
   * Delete a document by ID
   */
  async delete(id: string) {
    const collection = await getCollection();
    return collection.deleteOne({ _id: id });
  },
};
