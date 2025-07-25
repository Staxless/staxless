import type { Db, ObjectId } from 'mongodb';
import { ObjectId as MongoObjectId } from 'mongodb';
import { connectDB } from '../config/db-config.js';

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

let db: Db;

const initializeDatabase = async () => {
  const connection = await connectDB();
  db = connection.db(process.env.DATABASE_NAME);
  const collections = await db.listCollections({ name: 'users' }).toArray();
  if (collections.length === 0) {
    await db.createCollection('users', {
      validator: { $jsonSchema: userSchema },
    });
  } else {
    // Update validator for existing collection
    await db.command({
      collMod: 'users',
      validator: { $jsonSchema: userSchema },
    });
  }
};

initializeDatabase().catch(() => {
  // Ignore DB initialization errors at startup (handled elsewhere)
});

export const User = {
  async create(userData: Omit<UserType, '_id'> & { _id?: ObjectId }) {
    userData._id = userData._id || new MongoObjectId();
    userData.created_at = userData.created_at || new Date();
    userData.subscription = userData.subscription || {
      type: 'free',
      startDate: new Date(),
    };
    const result = await db.collection('users').insertOne(userData);
    return result;
  },

  async findOne(query: Partial<UserType>) {
    return await db.collection('users').findOne(query);
  },

  async updateSubscription(
    id: string | ObjectId,
    subscriptionData: UserType['subscription']
  ) {
    return await db.collection('users').updateOne(
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
    return await db.collection('users').updateOne(query, update);
  },
};
