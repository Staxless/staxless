/**
 * @file mongoDatabase.ts
 * @description MongoDB-specific database client implementation
 */

import { type Db, MongoClient } from 'mongodb';
import {
  BaseDatabase,
  type DatabaseConnectionParams,
  type QueryParams,
} from '../lib/database';

/**
 * MongoDB-specific database implementation
 * @class MongoDatabase
 * @extends BaseDatabase
 */
export class MongoDatabase extends BaseDatabase {
  private db?: Db;

  constructor(params: DatabaseConnectionParams) {
    super(params);
    this.client = new MongoClient(params.uri, {
      auth: params.uri.includes('@') ? undefined : undefined, // MongoDB URI typically includes auth credentials
    });
  }

  /**
   * Connects to the MongoDB database
   * @returns {Promise<void>} A promise that resolves when the connection is established
   * @throws {Error} If connection fails or DATABASE_URL is not set
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.params.dbName);
    } catch (error) {
      throw new Error(
        `Failed to connect to MongoDB: ${(error as Error).message}`
      );
    }
  }

  /**
   * Disconnects from the MongoDB database
   * @returns {Promise<void>} A promise that resolves when the connection is closed
   * @throws {Error} If disconnection fails
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.close();
    } catch (error) {
      throw new Error(
        `Failed to disconnect from MongoDB: ${(error as Error).message}`
      );
    }
  }

  /**
   * Retrieves the MongoDB database instance
   * @returns {Db} The MongoDB database instance
   * @throws {Error} If not connected
   */
  getClient(): Db {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  /**
   * Executes a find query on a MongoDB collection
   * @param params - Query parameters
   * @returns {Promise<T[]>} An array of matching documents
   * @throws {Error} If not connected or collection is invalid
   */
  async find<T>(params: QueryParams<T>): Promise<T[]> {
    const db = this.getClient();
    const collection = db.collection(params.collection);
    try {
      return (await collection.find(params.filter || {}).toArray()) as T[];
    } catch (error) {
      throw new Error(
        `Failed to execute find query on collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Inserts a single document into a MongoDB collection
   * @param params - Query parameters including data to insert
   * @returns {Promise<void>} A promise that resolves when the document is inserted
   * @throws {Error} If data is missing or insertion fails
   */
  async insertOne<T>(params: QueryParams<T>): Promise<void> {
    await super.insertOne(params); // Validate params using BaseDatabase
    const db = this.getClient();
    const collection = db.collection(params.collection);
    try {
      await collection.insertOne(params.data!);
    } catch (error) {
      throw new Error(
        `Failed to insert document into collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Updates documents in a MongoDB collection
   * @param params - Query parameters including filter and data to update
   * @returns {Promise<void>} A promise that resolves when the update is complete
   * @throws {Error} If data or filter is missing
   */
  async update<T>(params: QueryParams<T>): Promise<void> {
    await super.update(params); // Validate params using BaseDatabase
    const db = this.getClient();
    const collection = db.collection(params.collection);
    try {
      await collection.updateMany(
        params.filter!,
        { $set: params.data },
        params.options
      );
    } catch (error) {
      throw new Error(
        `Failed to update documents in collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Deletes documents from a MongoDB collection
   * @param params - Query parameters including filter
   * @returns {Promise<void>} A promise that resolves when the deletion is complete
   * @throws {Error} If filter is missing
   */
  async delete<T>(params: QueryParams<T>): Promise<void> {
    await super.delete(params); // Validate params using BaseDatabase
    const db = this.getClient();
    const collection = db.collection(params.collection);
    try {
      await collection.deleteMany(params.filter!);
    } catch (error) {
      throw new Error(
        `Failed to delete documents from collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }
}

/**
 * Creates a MongoDB database instance
 * @function createMongoDatabase
 * @param params - Database connection parameters
 * @returns {MongoDatabase} A configured MongoDB database instance
 * @example
 * const db = createMongoDatabase({ uri: process.env.DATABASE_URL, dbName: 'appdb' });
 * await db.connect();
 */
export function createMongoDatabase(
  params: DatabaseConnectionParams
): MongoDatabase {
  return new MongoDatabase(params);
}
