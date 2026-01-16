/**
 * @file database.ts
 * @description Base database interface and types for database operations
 */

export interface DatabaseConnectionParams {
  uri: string;
  dbName: string;
}

export interface QueryParams<T> {
  collection: string;
  filter?: Record<string, any>;
  data?: T;
  options?: Record<string, any>;
}

/**
 * Base abstract class for database implementations
 */
export abstract class BaseDatabase {
  protected client: any; // Will be MongoClient in MongoDatabase
  protected params: DatabaseConnectionParams;

  constructor(params: DatabaseConnectionParams) {
    this.params = params;
  }
 
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getClient(): any;
  abstract find<T>(params: QueryParams<T>): Promise<T[]>;
  abstract insertOne<T>(params: QueryParams<T>): Promise<void>;
  abstract update<T>(params: QueryParams<T>): Promise<void>;
  abstract delete<T>(params: QueryParams<T>): Promise<void>;

  /**
   * Validates parameters for insertOne operation
   */
  protected validateInsertOneParams<T>(params: QueryParams<T>): void {
    if (!params.data) {
      throw new Error('Data is required for insertOne operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required');
    }
  }

  /**
   * Validates parameters for update operation
   */
  protected validateUpdateParams<T>(params: QueryParams<T>): void {
    if (!params.data) {
      throw new Error('Data is required for update operation');
    }
    if (!params.filter) {
      throw new Error('Filter is required for update operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required');
    }
  }

  /**
   * Validates parameters for delete operation
   */
  protected validateDeleteParams<T>(params: QueryParams<T>): void {
    if (!params.filter) {
      throw new Error('Filter is required for delete operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required');
    }
  }
}