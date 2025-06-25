import { MongoClient } from "mongodb";

const DATABASE_NAME = "database";
const MONGO_URL = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;

export async function connectDB(): Promise<MongoClient> {
  try {
    const client = new MongoClient(MONGO_URL, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    await client.connect();
     
    client.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
    return client;
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err.message}`);
    throw err;
  }
}