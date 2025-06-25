/**
 * @file server.ts
 * @description Node.js server for authentication service using Lucia and OAuth providers.
 * @module server
 */

import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

import healthCheckRoutes from "./routes/healthRouter";
import magicLinkRoutes from "./routes/magicLinkRouter";
import oauthRoutes  from "./routes/oauthRouter";
import authRoutes from "./routes/authRouter";

import { startAuthConsumer } from './consumers';

// Load environment variables
dotenv.config({ path: "./secrets/.env" });

/**
 * The Express application instance.
 * @type {Express}
 */
const app: Express = express();

// Middleware
/**
 * Middleware to log incoming request details.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Route: ${req.originalUrl} | Time: ${new Date().toLocaleString()}`);
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
 * Mounts OAuth-related routes at /auth.
 */
app.use("/oauth/", oauthRoutes);

/**
 * Mounts OAuth-related routes at /auth.
 */
app.use("/auth", magicLinkRoutes);

/**
 * Mounts authentication routes at the root path.
 */
app.use("/", authRoutes);

/**
 * The port number for the server, sourced from environment variables or defaulting to 8080.
 * @type {string | number}
 */
const PORT = process.env.PORT || 8080;

/**
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
  startAuthConsumer().catch(console.error);
});
