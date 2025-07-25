import { MongoClient } from 'mongodb';

const DATABASE_NAME = 'database';
const MONGO_URL = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;

export async function connectDB(): Promise<MongoClient> {
  const client = new MongoClient(MONGO_URL, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });
  await client.connect();

  client.on('error', (_err) => {
    // Intentionally ignore MongoDB client errors here (handled elsewhere)
  });
  return client;
}
