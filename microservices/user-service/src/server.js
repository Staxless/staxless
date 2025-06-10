/**
 * @file server.js
 * @description Node.js server for CRUD operations with Supabase and MongoDB.
 * @module userServer
 */

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user-routes.js";

// Load environment variables
dotenv.config({ path: "./secrets/.env" });
const PORT = process.env.PORT || 8082;

const app = express();


// Middleware
app.use(express.json());
app.use(cors("*"));

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

// Routes
app.use("/", userRoutes);

/**
 * Start the Express server
 */
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
