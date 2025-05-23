/**
 * @file server.js
 * @description Node.js server for email sending with Mailgun and MongoDB.
 * @module server
 */

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRouter.js";
import healthRoutes from "./routes/healthRouter.js";

// Load environment variables
dotenv.config({ path: "./.env" });

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

// Routes
app.use(express.json());
app.use(cors("*"));
app.use("/", healthRoutes);
app.use("/", emailRoutes);

// Start server
const PORT = process.env.PORT || 8084;

/**
 * Starts the Express server
 */
app.listen(PORT, () =>
  console.log(`Mailgun server running on http://localhost:${PORT}`),
);