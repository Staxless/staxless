/**
 * @file server.js
 * @description Express server setup for Stripe integration, including routes for regular Stripe operations and webhooks.
 * @module stripeServer
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeRoutes from "./src/stripe-routes.js";
import webhookRoutes from "./src/stripe-webhook-routes.js";

// Load environment variables
dotenv.config({ path: "./secrets/.env" });

const app = express();
const PORT = process.env.PORT || 8003;

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

// IMPORTANT: Handle Stripe webhook route BEFORE body parsing middleware
app.use("/", webhookRoutes);

// Regular routes can use JSON parsing
app.use(express.json());
app.use(cors("*"));
app.use("/", stripeRoutes);

/**
 * Start the Express server
 */
app.listen(PORT, () =>
  console.log(
    `${new Date().toLocaleTimeString()}: Server is running on port ${PORT}...`,
  ),
);
