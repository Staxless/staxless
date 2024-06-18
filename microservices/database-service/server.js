/*
  server.js

  Description: This Node.js application provides CRUD operations for products and users using Supabase as the database backend.

  How to get started:
  - Add products to Supabase database.
  - Set the following environment variables in your .env file:
    - PORT: The port number for the server to listen on.
    - DATABASE_URL: The URL of your Supabase database.
    - DATABASE_KEY: The API key for accessing your Supabase database.
*/

// Load environment variables from .env file
require("dotenv").config({ path: "./secrets/.env" });

// Import required modules
const express = require("express");
const cors = require("cors");
const supabase = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");

// Import route handlers
const productRoutes = require("./src/routes/products.js");
const userRoutes = require("./src/routes/users.js");

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

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: "*" })); // Enable CORS for all origins
app.use(logMiddleware); // Log route and time

// Apply routes
app.use("/users", userRoutes); // User routes
app.use("/products", productRoutes); // Product routes

// Initialize Supabase client
const client = supabase.createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY,
);

// Start the server
const PORT = process.env.PORT || 8002;
app.listen(process.env.PORT, () =>
  console.log(
    new Date().toLocaleTimeString() + `: Server is running on port ${PORT}...`,
  ),
);
