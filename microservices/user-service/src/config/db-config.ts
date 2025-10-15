/**
 * @file db-config.ts
 * @description Initializes and exports the shared MongoDB database connection for the auth service.
 */

import createDatabase, {
  type Database,
  type DatabaseConnectionParams,
} from '../lib/database';
import { createMongoDatabase } from './mongo-db-client';

/**
 * Database connection parameters
 */
const dbParams: DatabaseConnectionParams = {
  uri: process.env.DATABASE_URL || 'mongodb://mongodb-service:27017',
  dbName: process.env.DATABASE_NAME || 'auth_db',
};

/**
 * Shared database instance
 */
const db: Database = createDatabase(createMongoDatabase(dbParams));

/**
 * Initializes the database connection on service startup
 * @returns {Promise<void>}
 */
export async function initializeDatabase(): Promise<void> {
  await db.connect();
}

/**
 * Exports the database instance for use in other modules
 */
export const database = db;
