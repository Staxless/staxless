/**
 * @file server.js
 * @description Node.js server for CRUD operations with Supabase and MongoDB.
 * @module server
 */

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import healthCheckRoutes from "./src/routes/healthRouter.js"
import oauthRoutes from "./src/routes/oauthRouter.js";
import authRoutes from "./src/routes/authRouter.js";

// Load environment variables
dotenv.config({ path: "./secrets/.env" });

const app = express();

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

// Middleware
app.use(express.json());
app.use(cors("*"));
// origin: "http://back-gate:8080/"

// Routes
app.use("/", healthCheckRoutes);
app.use("/", oauthRoutes);
app.use("/", authRoutes);

// Start server
const PORT = process.env.PORT || 8080;

/**
 * Starts the Express server
 */
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
