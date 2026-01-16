/**
 * @file user-model.ts
 * @description Manages the MongoDB user collection operations using the shared database service.
 */
import {
  type Collection,
  type Db,
  ObjectId as MongoObjectId,
  type WithId,
} from 'mongodb';
import { database } from '../config/db-config.js';

export interface UserType {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  created_at: Date;
  roles: string[];
  subscription: {
    type: string;
    startDate: Date;
    endDate?: Date | null;
    subscriptionId?: string;
    status?: 'active' | 'pending_cancellation' | 'canceled';
    cancelAtPeriodEnd?: boolean;
    cancellationType?: 'period_end';
    canceledAt?: Date;
  };
  paymentStatus?: {
    lastFailed: boolean;
    failureReason: string | null;
    lastAttempt: Date | null;
    nextAttempt: Date | null;
    attemptCount: number | null;
  };
}

const userSchema = {
  bsonType: 'object',
  required: ['_id', 'roles', 'created_at', 'subscription'],
  properties: {
    _id: { bsonType: 'string' },
    firstname: { bsonType: 'string' },
    lastname: { bsonType: 'string' },
    email: {
      bsonType: ['string', 'null'],
      minLength: 1,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    },
    avatar: { bsonType: 'string' },
    created_at: { bsonType: 'date' },
    roles: { bsonType: 'array', items: { bsonType: 'string' } },
    subscription: {
      bsonType: 'object',
      required: ['type', 'startDate'],
      properties: {
        type: { bsonType: 'string' },
        startDate: { bsonType: 'date' },
        endDate: { bsonType: ['date', 'null'] },
        subscriptionId: { bsonType: ['string', 'null'] },
        status: { bsonType: ['string', 'null'] },
        cancelAtPeriodEnd: { bsonType: ['bool', 'null'] },
        cancellationType: { bsonType: ['string', 'null'] },
        canceledAt: { bsonType: ['date', 'null'] },
      },
    },
    paymentStatus: {
      bsonType: ['object', 'null'],
      properties: {
        lastFailed: { bsonType: 'bool' },
        failureReason: { bsonType: ['string', 'null'] },
        lastAttempt: { bsonType: ['date', 'null'] },
        nextAttempt: { bsonType: ['date', 'null'] },
        attemptCount: { bsonType: ['int', 'null'] },
      },
    },
  },
};

// Cache the collection to avoid re-initialization on every call
let cachedCollection: Collection<UserType> | null = null;
let isInitializing = false;
let initializationPromise: Promise<Collection<UserType>> | null = null;

/**
 * Get or initialize the users collection
 * Only creates/modifies collection schema once
 */
const getCollection = async (): Promise<Collection<UserType>> => {
  // Return cached collection if available
  if (cachedCollection) {
    return cachedCollection;
  }

  // If already initializing, wait for that to complete
  if (isInitializing && initializationPromise) {
    return await initializationPromise;
  }

  // Start initialization
  isInitializing = true;
  initializationPromise = (async () => {
    try {
      const db: Db = await database.getClient();
      const collections = await db.listCollections({ name: 'users' }).toArray();

      // Only create/modify collection if it doesn't exist
      // This requires elevated permissions, so we skip it if collection exists
      if (collections.length === 0) {
        console.log('Creating users collection with schema validation...');
        try {
          await db.createCollection('users', {
            validator: { $jsonSchema: userSchema },
          });
          console.log('✅ Users collection created with validation');
        } catch (createError: any) {
          // If we don't have permission, just use the collection without validation
          if (
            createError.codeName === 'Unauthorized' ||
            createError.code === 13
          ) {
            console.warn(
              '⚠️  No permission to create collection with validator. Using collection without schema validation.'
            );
          } else {
            throw createError;
          }
        }
      } else {
        // Collection exists - don't try to modify it (requires collMod permission)
        console.log(
          'Users collection already exists, skipping schema validation setup'
        );
      }

      const collection = db.collection<UserType>('users');
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

export const User = {
  async create(userData: Omit<UserType, '_id'> & { _id?: string }) {
    const collection = await getCollection();
    userData._id = userData._id || new MongoObjectId().toString();
    userData.created_at = userData.created_at || new Date();
    userData.subscription = userData.subscription || {
      type: 'free',
      startDate: new Date(),
    };
    return await collection.insertOne(userData as UserType);
  },

  findOne(query: { _id: string }): Promise<WithId<UserType> | null> {
    return getCollection().then((collection) => collection.findOne(query));
  },

  updateSubscription(id: string, subscriptionData: UserType['subscription']) {
    return getCollection().then((collection) =>
      collection.updateOne(
        { _id: id },
        {
          $set: {
            subscription: subscriptionData,
            subscriptionUpdatedAt: new Date(),
          },
        }
      )
    );
  },

  updateOne(
    query: { _id: string },
    update: Partial<UserType> | { [key: string]: any }
  ) {
    return getCollection().then((collection) =>
      collection.updateOne(query, update)
    );
  },
};
