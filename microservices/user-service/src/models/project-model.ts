/**
 * @file project-model.ts
 * @description Manages user projects (backlinks/websites) stored in MongoDB
 */
import {
  type Collection,
  type Db,
  ObjectId,
  type WithId,
} from 'mongodb';
import { database } from '../config/db-config.js';

export interface ProjectType {
  _id?: ObjectId;
  userId: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = {
  bsonType: 'object',
  required: ['userId', 'name', 'url', 'isActive', 'createdAt', 'updatedAt'],
  properties: {
    userId: { bsonType: 'string' },
    name: { bsonType: 'string', minLength: 1, maxLength: 100 },
    url: { bsonType: 'string', minLength: 1 },
    isActive: { bsonType: 'bool' },
    createdAt: { bsonType: 'date' },
    updatedAt: { bsonType: 'date' },
  },
};

let cachedCollection: Collection<ProjectType> | null = null;
let isInitializing = false;
let initializationPromise: Promise<Collection<ProjectType>> | null = null;

/**
 * Get or initialize the projects collection
 */
const getCollection = async (): Promise<Collection<ProjectType>> => {
  if (cachedCollection) {
    return cachedCollection;
  }

  if (isInitializing && initializationPromise) {
    return await initializationPromise;
  }

  isInitializing = true;
  initializationPromise = (async () => {
    try {
      const db: Db = await database.getClient();
      const collections = await db.listCollections({ name: 'projects' }).toArray();

      if (collections.length === 0) {
        console.log('Creating projects collection with schema validation...');
        try {
          await db.createCollection('projects', {
            validator: { $jsonSchema: projectSchema },
          });
          // Create index on userId for faster queries
          const collection = db.collection('projects');
          await collection.createIndex({ userId: 1 });
          console.log('✅ Projects collection created with validation and index');
        } catch (createError: any) {
          if (createError.codeName === 'Unauthorized' || createError.code === 13) {
            console.warn('⚠️  No permission to create collection with validator.');
          } else {
            throw createError;
          }
        }
      } else {
        console.log('Projects collection already exists');
      }

      const collection = db.collection<ProjectType>('projects');
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

export const Project = {
  /**
   * Create a new project for a user
   */
  async create(projectData: Omit<ProjectType, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await getCollection();
    const now = new Date();
    const project: ProjectType = {
      ...projectData,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(project);
    return { ...project, _id: result.insertedId };
  },

  /**
   * Find all projects for a user
   */
  async findByUserId(userId: string): Promise<WithId<ProjectType>[]> {
    const collection = await getCollection();
    return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  },

  /**
   * Find a specific project by ID
   */
  async findById(projectId: string): Promise<WithId<ProjectType> | null> {
    const collection = await getCollection();
    return collection.findOne({ _id: new ObjectId(projectId) });
  },

  /**
   * Update a project
   */
  async update(
    projectId: string,
    userId: string,
    updates: Partial<Pick<ProjectType, 'name' | 'url' | 'isActive'>>
  ) {
    const collection = await getCollection();
    return collection.updateOne(
      { _id: new ObjectId(projectId), userId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  },

  /**
   * Delete a project
   */
  async delete(projectId: string, userId: string) {
    const collection = await getCollection();
    return collection.deleteOne({ _id: new ObjectId(projectId), userId });
  },

  /**
   * Toggle project active status
   */
  async toggleActive(projectId: string, userId: string) {
    const collection = await getCollection();
    const project = await collection.findOne({ _id: new ObjectId(projectId), userId });
    if (!project) return null;

    return collection.updateOne(
      { _id: new ObjectId(projectId), userId },
      { $set: { isActive: !project.isActive, updatedAt: new Date() } }
    );
  },
};
