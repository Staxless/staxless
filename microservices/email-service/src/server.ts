
/**
 * @file server.ts
 * @description Node.js server for authentication service using Lucia and OAuth providers.
 * @module server
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthCheckRoutes from "./routes/healthRouter.ts"

import { startEmailConsumer } from './consumers';


// Load environment variables
dotenv.config({ path: "./secrets/.env" });

const app = express();
const PORT = process.env.PORT || 8084;

/**
 * Logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((req, res, next) => {
  console.log(
    `Route: ${req.originalUrl} | Time: ${new Date().toLocaleString()}`,
  );
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
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true }));


// Routes
/**
 * Mounts health check routes at the root path.
 */
app.use("/", healthCheckRoutes);

/**
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
app.listen(PORT, () => {
  console.log(`Email service running on http://localhost:${PORT}`);
  startEmailConsumer().catch(console.error);
});