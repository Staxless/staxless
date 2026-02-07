/**
 * @file mongo-db-client.ts
 * @description MongoDB-specific database client implementation
 */

import type { Document, MatchKeysAndValues } from 'mongodb';
import { type Db, MongoClient } from 'mongodb';
import {
  BaseDatabase,
  type DatabaseConnectionParams,
  type QueryParams,
} from '../lib/database.js';

/**
 * MongoDB-specific database implementation
 * @class MongoDatabase
 * @extends BaseDatabase
 */
export class MongoDatabase extends BaseDatabase {
  client: MongoClient;
  params!: DatabaseConnectionParams;
  db?: Db;
  isConnecting: Promise<void> | null = null;
  isConnected = false;

  constructor(params: DatabaseConnectionParams) {
    super(params);
    this.params = params;
    this.client = new MongoClient(params.uri);
  }

  /**
   * Connects to the MongoDB database
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.isConnecting) {
      return this.isConnecting;
    }

    try {
      this.isConnecting = (async () => {
        await this.client.connect();
        this.db = this.client.db(this.params.dbName);
        this.isConnected = true;
        this.isConnecting = null;
      })();
      await this.isConnecting;
    } catch (error) {
      this.isConnecting = null;
      this.isConnected = false;
      throw new Error(
        `Failed to connect to MongoDB: ${(error as Error).message}`
      );
    }
  }

  /**
   * Disconnects from the MongoDB database
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.close();
      this.db = undefined;
      this.isConnected = false;
    } catch (error) {
      throw new Error(
        `Failed to disconnect from MongoDB: ${(error as Error).message}`
      );
    }
  }

  /**
   * Retrieves the MongoDB database instance
   */
  async getClient(): Promise<Db> {
    if (this.isConnected && this.db) {
      return this.db;
    }

    if (this.isConnecting) {
      await this.isConnecting;
      if (this.db) {
        return this.db;
      }
      throw new Error('Database connection failed');
    }

    await this.connect();
    if (!this.db) {
      throw new Error('Database connection failed');
    }

    return this.db;
  }

  /**
   * Executes a find query on a MongoDB collection
   */
  async find<T>(params: QueryParams<T>): Promise<T[]> {
    const db = await this.getClient();
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
   */
  async insertOne<T>(params: QueryParams<T>): Promise<void> {
    this.validateInsertOneParams(params);
    const db = await this.getClient();
    const collection = db.collection(params.collection);
    if (!params.data) {
      throw new Error('InsertOne: data is required');
    }
    try {
      await collection.insertOne(params.data);
    } catch (error) {
      throw new Error(
        `Failed to insert document into collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Updates documents in a MongoDB collection
   */
  async update<T>(params: QueryParams<T>): Promise<void> {
    this.validateUpdateParams(params);
    const db = await this.getClient();
    const collection = db.collection(params.collection);
    if (!params.filter) {
      throw new Error('Update: filter is required');
    }
    if (!params.data) {
      throw new Error('Update: data is required');
    }
    try {
      await collection.updateOne(
        params.filter as MatchKeysAndValues<Document>,
        { $set: params.data }
      );
    } catch (error) {
      throw new Error(
        `Failed to update documents in collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Deletes documents from a MongoDB collection
   */
  async delete<T>(params: QueryParams<T>): Promise<void> {
    this.validateDeleteParams(params);
    const db = await this.getClient();
    const collection = db.collection(params.collection);
    if (!params.filter) {
      throw new Error('Delete: filter is required');
    }
    try {
      await collection.deleteMany(
        params.filter as MatchKeysAndValues<Document>
      );
    } catch (error) {
      throw new Error(
        `Failed to delete documents from collection ${params.collection}: ${(error as Error).message}`
      );
    }
  }
}

/**
 * Creates a MongoDB database instance
 */
export function createMongoDatabase(
  params: DatabaseConnectionParams
): MongoDatabase {
  return new MongoDatabase(params);
}
