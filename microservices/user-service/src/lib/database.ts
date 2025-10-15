/**
 * @file database.ts
 * @description Generic database service interface and base class for microservices
 */

/**
 * Interface defining the structure of database connection parameters
 * @interface DatabaseConnectionParams
 */
export interface DatabaseConnectionParams {
  /** The database connection URI */
  uri: string;
  /** The database name */
  dbName: string;
}

/**
 * Interface defining the structure of a database query
 * @interface QueryParams
 */
export interface QueryParams<T = any> {
  /** The collection or table name */
  collection: string;
  /** The query filter or conditions */
  filter?: Record<string, any>;
  /** The data to insert or update */
  data?: T;
  /** Optional query options (e.g., sort, limit) */
  options?: Record<string, any>;
}

/**
 * Interface defining the database service contract
 * @interface Database
 */
export interface Database {
  /** Connects to the database */
  connect: () => Promise<void>;
  /** Disconnects from the database */
  disconnect: () => Promise<void>;
  /** Retrieves the underlying database client or instance */
  getClient: () => any;
  /** Executes a find query */
  find: <T>(params: QueryParams<T>) => Promise<T[]>;
  /** Inserts a single document or record */
  insertOne: <T>(params: QueryParams<T>) => Promise<void>;
  /** Updates documents or records matching the filter */
  update: <T>(params: QueryParams<T>) => Promise<void>;
  /** Deletes documents or records matching the filter */
  delete: <T>(params: QueryParams<T>) => Promise<void>;
}

/**
 * Abstract base class for database implementations
 * @abstract
 * @class BaseDatabase
 */
export abstract class BaseDatabase implements Database {
  protected client: any;

  constructor(protected params: DatabaseConnectionParams) {
    if (!params.uri) {
      throw new Error('Missing DATABASE_URL environment variable');
    }
    if (!params.dbName) {
      throw new Error('Missing DATABASE_NAME environment variable');
    }
  }

  /**
   * Connects to the database
   * @abstract
   * @returns {Promise<void>} A promise that resolves when the connection is established
   * @throws {Error} If connection fails
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnects from the database
   * @abstract
   * @returns {Promise<void>} A promise that resolves when the connection is closed
   * @throws {Error} If disconnection fails
   */
  abstract disconnect(): Promise<void>;

  /**
   * Retrieves the underlying database client or instance
   * @abstract
   * @returns {any} The database client or instance
   * @throws {Error} If not connected
   */
  abstract getClient(): any;

  /**
   * Executes a find query
   * @abstract
   * @param params - Query parameters
   * @returns {Promise<T[]>} An array of matching documents or records
   * @throws {Error} If query fails or parameters are invalid
   */
  abstract find<T>(params: QueryParams<T>): Promise<T[]>;

  /**
   * Inserts a single document or record
   * @param params - Query parameters including data to insert
   * @returns {Promise<void>} A promise that resolves when the document is inserted
   * @throws {Error} If data or collection is missing
   */
  async insertOne<T>(params: QueryParams<T>): Promise<void> {
    if (!params.data) {
      throw new Error('Data is required for insert operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required for insert operation');
    }
  }

  /**
   * Updates documents or records matching the filter
   * @param params - Query parameters including filter and data to update
   * @returns {Promise<void>} A promise that resolves when the update is complete
   * @throws {Error} If data, filter, or collection is missing
   */
  async update<T>(params: QueryParams<T>): Promise<void> {
    if (!params.data) {
      throw new Error('Data is required for update operation');
    }
    if (!params.filter) {
      throw new Error('Filter is required for update operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required for update operation');
    }
  }

  /**
   * Deletes documents or records matching the filter
   * @param params - Query parameters including filter
   * @returns {Promise<void>} A promise that resolves when the deletion is complete
   * @throws {Error} If filter or collection is missing
   */
  async delete<T>(params: QueryParams<T>): Promise<void> {
    if (!params.filter) {
      throw new Error('Filter is required for delete operation');
    }
    if (!params.collection) {
      throw new Error('Collection name is required for delete operation');
    }
  }
}

/**
 * Creates a database service instance with the provided database client
 * @function createDatabase
 * @param dbImpl - The database implementation (e.g., MongoDB, PostgreSQL)
 * @returns {Database} A database service instance
 * @throws {Error} If disconnection fails during SIGTERM
 * @example
 * const mongoDb = createMongoDatabase({ uri: process.env.DATABASE_URL, dbName: 'appdb' });
 * const dbService = createDatabase(mongoDb);
 * await dbService.connect();
 */
export function createDatabase(dbImpl: Database): Database {
  // Handle SIGTERM for graceful shutdown
  process.on('SIGTERM', async () => {
    try {
      await dbImpl.disconnect();
    } catch (error) {
      throw new Error(`Failed to disconnect database during SIGTERM: ${(error as Error).message}`);
    }
    process.exit(0);
  });

  return dbImpl;
}

/**
 * Default export of the createDatabase instance factory function
 * @default
 */
export default createDatabase;