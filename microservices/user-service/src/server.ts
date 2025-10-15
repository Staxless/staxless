/**
 * @file server.ts
 * @description Node.js server for user management.
 * @module server
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { initializeDatabase } from './config/db-config';
import { startUserConsumer } from './consumers';
import healthCheckRoutes from './routes/health-router';
import userRoutes from './routes/user-routes';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

const app = express();
const PORT = process.env.PORT || 8082;

/**
 * Logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((_req, _res, next) => {
  next();
});

/**
 * Middleware to parse JSON request bodies.
 */
app.use(express.json());

/**
 * Middleware to enable CORS with configured origin and credentials.
 * @remarks Uses the FRONTEND_URL environment variable or defaults to http://localhost:3000.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
/**
 * Mounts health check routes at the root path.
 */
app.use('/', healthCheckRoutes);

/**
 * Mounts Stripe-related routes at the root path.
 * @remarks Handles Stripe payment intents, products, and prices.
 */
app.use('/', userRoutes);

/**
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    await startUserConsumer();
  } catch (error) {
    throw new Error(`Failed to start server: ${(error as Error).message}`);
  }
});
