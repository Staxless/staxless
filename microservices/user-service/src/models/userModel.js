import { MongoClient, ObjectId } from "mongodb";

const DATABASE_NAME = process.env.DATABASE_NAME; // Replace with your database name
const url = `mongodb://mongodb-service:27017/`;
let db;

// Define the User collection schema
const userSchema = {
  name: {
    bsonType: "string",
    description: "must be a string and is required",
    uniqueItems: true,
  },
  _id: {
    bsonType: "string",
    description: "must be a string and is required",
    uniqueItems: true,
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
};

// Function to connect to MongoDB
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

// Function to check and create the user collection
const createuserCollection = async () => {
  try {
    const collections = await db.listCollections({ name: "user" }).toArray();
    if (collections.length === 0) {
      // Collection does not exist, create it with validation
      await db.createCollection("user", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "_id", "roles"], //, "createdAt","lastActive"],
            properties: userSchema,
          },
        },
      });
      console.log("user collection created!");
    } else {
      console.log("user collection already exists.");
    }
  } catch (error) {
    console.error("Error checking or creating collection:", error);
    throw error;
  }
};

// Function to list all collections
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

// Define methods for interacting with the user collection
const User = {
  async create(userData) {
    try {
      userData.createdAt = userData.createdAt || new Date();
      userData.lastActive = userData.lastActive || new Date();
      console.log("Inserting user data:", userData);
      const result = await db.collection("user").insertOne(userData);
      console.log("User inserted:", result);
      return result;
    } catch (error) {
      console.error("Error creating user:", userData, error);
      throw error;
    }
  },

  async findOne({ id, name }) {
    try {
      // Build query based on the provided criteria
      const query = {};
      if (id) query.id = id;
      if (name) query.name = name;

      // Perform the query
      return await db.collection("user").findOne(query);
    } catch (error) {
      console.error("Error finding user by criteria:", error);
      throw error;
    }
  },

  async updateLastActive(name) {
    try {
      return await db
        .collection("user")
        .updateOne({ name }, { $set: { lastActive: new Date() } });
    } catch (error) {
      console.error("Error updating last active:", error);
      throw error;
    }
  },

  // Add more methods as needed
};

// Main function to connect and initialize the database
const initializeDatabase = async () => {
  await connectToMongoDB();
  await createuserCollection();
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
