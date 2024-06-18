/*
  Description:
  This Node.js application handles authentication routes using Express.js.

  How to get started:
  1. Create a ".env" file in the "secrets" directory.
  2. Add the following environment variables in your ".env" file:
    - PORT: The port number for the server to listen on.
    - JWT_SECRET_KEY: This is the key that will be used to create JWTs
      - Create with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
*/

// Load environment variables from .env file
require("dotenv").config({ path: "./secrets/.env" });

// Import required modules
const express = require("express");
const cors = require("cors");

// Import route handlers
const authRoutes = require("./src/auth.js");

// Initialize the Express application
const app = express();

/**
 * Middleware function to log route and time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function logMiddleware(req, res, next) {
  // Get the current time
  const currentTime = new Date().toLocaleString();
  // Log the route and time
  console.log(`Route: ${req.originalUrl} | Time: ${currentTime}`);
  // Move to the next middleware or route handler
  next();
}

// Apply middleware
app.use(cors({ origin: "*" })); // Enable CORS for all origins
app.use(logMiddleware); // Log route and time
app.use("/", authRoutes); // Handle authentication routes

// Start the server
app.listen(process.env.PORT, () =>
  console.log(
    new Date().toLocaleTimeString() +
      `: Server is running on port ${process.env.PORT}...`,
  ),
);
