/**
 * @file user-model.ts
 * @description Manages the MongoDB user collection operations using the shared database service.
 */

import { type Collection, ObjectId as MongoObjectId } from 'mongodb';
import { database } from '../config/db-config';

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

const initializeCollection = async (): Promise<Collection> => {
  const db = database.getClient();
  const collections = await db.listCollections({ name: 'users' }).toArray();
  if (collections.length === 0) {
    await db.createCollection('users', {
      validator: { $jsonSchema: userSchema },
    });
  } else {
    await db.command({
      collMod: 'users',
      validator: { $jsonSchema: userSchema },
    });
  }
  return db.collection('users');
};

export const User = {
  async create(userData: Omit<UserType, '_id'> & { _id?: MongoObjectId }) {
    const collection = await initializeCollection();
    userData._id = userData._id || new MongoObjectId();
    userData.created_at = userData.created_at || new Date();
    userData.subscription = userData.subscription || {
      type: 'free',
      startDate: new Date(),
    };
    const result = await collection.insertOne(userData);
    return result;
  },

  async findOne(query: Partial<UserType>) {
    const collection = await initializeCollection();
    return await collection.findOne(query);
  },

  async updateSubscription(
    id: string | MongoObjectId,
    subscriptionData: UserType['subscription']
  ) {
    const collection = await initializeCollection();
    return await collection.updateOne(
      { _id: id },
      {
        $set: {
          subscription: subscriptionData,
          subscriptionUpdatedAt: new Date(),
        },
      }
    );
  },

  async updateOne(query: { _id: string }, update: Partial<UserType>) {
    const collection = await initializeCollection();
    return await collection.updateOne(query, update);
  },
};

initializeCollection().catch(() => {
  // Ignore DB initialization errors at startup (handled elsewhere)
});
