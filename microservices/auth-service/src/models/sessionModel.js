import { MongoClient, ObjectId } from "mongodb";

const DATABASE_NAME = "database"; // Replace with your database name
const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;
let db;

// Define the session collection schema
const sessionSchema = {
  _id: { type: String, required: true, unique: true },
  user_id: { type: ObjectId, required: true },
  expires_at: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now },
};

// Connect to MongoDB
MongoClient.connect(url, {})
  .then((client) => {
    db = client.db(dbName);

    // Check if the session collection exists
    return db.listCollections({ name: "session" }).toArray();
  })
  .then((collections) => {
    if (collections.length === 0) {
      // Collection does not exist, create it
      return db.createCollection("session", {
        validator: { $jsonSchema: sessionSchema },
      });
    } else {
      console.log("Collection already exists.");
    }
  })
  .then(() => {
    console.log("Collection is created!");
  })
  .catch((error) => {
    console.error("Error checking or creating collection:", error);
  })
  .finally(() => {
    // Log registered collections
    db.listCollections()
      .toArray()
      .then((collections) => {
        console.log(
          "Registered collections:",
          collections.map((col) => col.name),
        );
      });
  });

export const Session = {
  // Define methods for interacting with the session collection
  create(sessionData) {
    sessionData.createdAt = sessionData.createdAt || new Date();
    sessionData.lastAccessed = sessionData.lastAccessed || new Date();
    return db.collection("session").insertOne(sessionData);
  },

  findById(sessionId) {
    return db.collection("session").findOne({ sessionId });
  },

  updateLastAccessed(sessionId) {
    return db
      .collection("session")
      .updateOne({ sessionId }, { $set: { lastAccessed: new Date() } });
  },

  // Add more methods as needed
};
