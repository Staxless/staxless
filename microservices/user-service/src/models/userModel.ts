import { MongoClient, ObjectId, Db } from "mongodb";
import  getDbConnection  from "../config/db-config.js";

interface User {
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
    endDate?: Date;
  };
}

const userSchema = {
  bsonType: "object",
  required: ["_id", "email", "roles", "created_at", "subscription"],
  properties: {
    _id: { bsonType: "string" },
    firstname: { bsonType: "string" },
    lastname: { bsonType: "string" },
    email: { bsonType: "string" },
    avatar: { bsonType: "string" },
    created_at: { bsonType: "date" },
    roles: { bsonType: "array", items: { bsonType: "string" } },
    subscription: {
      bsonType: "object",
      required: ["type", "startDate"],
      properties: {
        type: { bsonType: "string" },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
      },
    },
  },
};

let db: Db;

const initializeDatabase = async () => {
  const connection = await getDbConnection();
  db = connection.db(process.env.DATABASE_NAME);
  const collections = await db.listCollections({ name: "users" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("users", {
      validator: { $jsonSchema: userSchema },
    });
    console.log("User collection created!");
  }
};

initializeDatabase().catch((error) => console.error("Database initialization failed:", error));

export const User = {
  async create(userData: User) {
    userData.created_at = userData.created_at || new Date();
    userData.subscription = userData.subscription || { type: "free", startDate: new Date() };
    const result = await db.collection("users").insertOne(userData);
    return result;
  },

  async findOne(query: Partial<User>) {
    return await db.collection("users").findOne(query);
  },

  async updateSubscription(id: string, subscriptionData: User["subscription"]) {
    return await db.collection("users").updateOne(
      { _id: id },
      { $set: { subscription: subscriptionData, subscriptionUpdatedAt: new Date() } }
    );
  },
};
