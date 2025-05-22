/**
 * @file userModel.js
 * @description MongoDB connection and user collection management
 * @module userDb
 */

import { MongoClient, ObjectId } from "mongodb";

const DATABASE_NAME = process.env.DATABASE_NAME;
const url = `mongodb://mongodb-service:27017/`;
let db;

/**
 * User schema definition
 * @type {Object}
 */
const userSchema = {
  firstname: {
    bsonType: "string",
    description: "must be a string",
  },
  lastname: {
    bsonType: "string",
    description: "must be a string",
  },
  email: {
    bsonType: "string",
    description: "must be a string and is required",
    uniqueItems: true,
  },
  _id: {
    bsonType: "string",
    description: "must be a string and is required",
    uniqueItems: true,
  },
  avatar: {
    bsonType: "string",
    description: "must be a string",
  },
  created_at: {
    bsonType: "date",
    description: "must be a date and is required",
  },
  roles: {
    bsonType: "array",
    items: { bsonType: "string" },
    description: "must be an array of strings",
  },
  subscription: {
    bsonType: "object",
    required: ["type", "startDate"],
    properties: {
      type: { bsonType: "string" },
      startDate: { bsonType: "date" },
      endDate: { bsonType: "date" },
    },
    description: "must be an object with type and dates",
  },
};

/**
 * Connect to MongoDB.
 * @returns {Promise<Db>} The MongoDB database instance.
 * @throws {Error} If the connection fails.
 */
const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(DATABASE_NAME);
    console.log(`Connected to database: ${DATABASE_NAME}`);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

/**
 * Create the user collection if it doesn't exist.
 * @returns {Promise<void>}
 * @throws {Error} If there's an error checking or creating the collection.
 */
const createUserCollection = async () => {
  try {
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["_id", "email", "roles", "created_at", "subscription"],
            properties: userSchema,
          },
        },
      });
      console.log("User collection created!");
    } else {
      console.log("User collection already exists.");
    }
  } catch (error) {
    console.error("Error checking or creating collection:", error);
    throw error;
  }
};

/**
 * List all collections in the database.
 * @returns {Promise<void>}
 */
const listCollections = async () => {
  try {
    const collections = await db.listCollections().toArray();
    console.log(
      "Registered collections:",
      collections.map((col) => col.name),
    );
  } catch (error) {
    console.error("Error listing collections:", error);
  }
};

/**
 * User operations object
 * @type {Object}
 */
const User = {
  /**
   * Create a new user.
   * @param {Object} userData - The user data to insert.
   * @returns {Promise<Object>} The result of the insert operation.
   * @throws {Error} If there's an error creating the user.
   */
  async create(userData) {
    try {
      userData.created_at = userData.created_at || new Date();
      userData.subscription = userData.subscription || {
        type: "free",
        startDate: new Date(),
      };
      console.log("Inserting user data:", userData);
      const result = await db.collection("user").insertOne(userData);
      console.log("User inserted:", result);
      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Find a user by query.
   * @param {Object} query - The query to find the user.
   * @returns {Promise<Object|null>} The found user or null.
   * @throws {Error} If there's an error finding the user.
   */
  async findOne(query) {
    try {
      return await db.collection("user").findOne(query);
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  },

  /**
   * Update the last active timestamp for a user.
   * @param {string} id - The user's ID.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {Error} If there's an error updating the last active timestamp.
   */
  async updateLastActive(id) {
    try {
      return await db
        .collection("users")
        .updateOne({ _id: id }, { $set: { lastActive: new Date() } });
    } catch (error) {
      console.error("Error updating last active:", error);
      throw error;
    }
  },

  /**
   * Update a user's subscription.
   * @param {string} id - The user's ID.
   * @param {Object} subscriptionData - The new subscription data.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {Error} If there's an error updating the subscription.
   */
  async updateSubscription(id, subscriptionData) {
    try {
      return await db.collection("user").updateOne(
        { _id: id },
        {
          $set: {
            subscription: subscriptionData,
            subscriptionUpdatedAt: new Date(),
          },
        },
      );
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },
};

/**
 * Initialize the database connection and setup collections.
 * @returns {Promise<void>}
 */
const initializeDatabase = async () => {
  await connectToMongoDB();
  await createUserCollection();
  await listCollections();
};

// Initialize the database
initializeDatabase()
  .then(() => {
    console.log("Database initialization completed.");
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
  });

export default User;
