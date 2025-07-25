/**
 * @file magic-link-model.ts
 * @description Manages the MongoDB schema and operations for magic link tokens in the auth service.
 *
 * @module MagicLinkModel
 * @see MongoDB, Node.js
 *
 * @functions
 * - connectToMongoDB: Establishes a MongoDB connection.
 * - createMagicLinksCollection: Initializes the 'magicLinks' collection with schema validation.
 * - listCollections: Logs existing collections in the database.
 * - MagicLink.create: Inserts a new magic link token.
 * - MagicLink.findByToken: Finds a magic link by its token.
 * - MagicLink.delete: Deletes a magic link by its token.
 * - initializeDatabase: Orchestrates initial DB connection and setup.
 */

import type { Db } from 'mongodb';

const DATABASE_NAME = process.env.DATABASE_NAME || 'auth_db';
const _url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let _db: Db;

// Define the magic link collection schema
const _magicLinkSchema = {
  bsonType: 'object',
  required: ['token', 'user_id', 'expires_at', 'created_at'],
  properties: {
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

// ...rest of file unchanged...
