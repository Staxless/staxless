/**
 * @file db-config.ts
 * @description Initializes the database connection for the application.
 */

import type { BaseDatabase } from '../lib/database.js';
import { loadSecret } from '../lib/secrets-manager.js';
import { createMongoDatabase } from './mongo-db-client.js';

/**
 * Database instance for the application.
 * @type {BaseDatabase}
 */
export const database: BaseDatabase = createMongoDatabase({
  uri:
    loadSecret('DATABASE_URL') ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017',
  dbName: loadSecret('DATABASE_NAME') || process.env.DATABASE_NAME || 'db',
});
/**
 * Initializes the database connection.
 * @returns {Promise<void>} A promise that resolves when the database is connected.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await database.connect();
  } catch (error) {
    throw new Error(
      `Failed to initialize database: ${(error as Error).message}`
    );
  }
}

/**
 * Closes the database connection.
 * @returns {Promise<void>} A promise that resolves when the database connection is closed.
 */
export async function closeDatabase(): Promise<void> {
  try {
    await database.disconnect();
  } catch (error) {
    throw new Error(
      `Failed to close database connection: ${(error as Error).message}`
    );
  }
}
