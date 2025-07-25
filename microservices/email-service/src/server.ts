/**
 * @file server.ts
 * @description Node.js server for authentication service using Lucia and OAuth providers.
 * @module server
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { startEmailConsumer } from './consumers';
import healthCheckRoutes from './routes/health-router';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

const app = express();
const PORT = process.env.PORT || 8084;

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
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
// Fixed:

app.listen(PORT, async () => {
  try {
    await startEmailConsumer();
  } catch (error) {
    throw new Error(`[Email Service] Failed to start email consumer: ${error}`);
  }
});
