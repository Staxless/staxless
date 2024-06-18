/*
  server.js

  Description: Entry point for the Stripe API microservice.

  How to get started:
  - Add products to Supabase database.
  - Set the following environment variables in your .env file:
    - PORT: The port number for the server to listen on.
    - STRIPE_PRIVATE_KEY: The API key you get from your Stripe Account.
    - CLIENT_URL: Your checkout url.
*/

// Load environment variables from .env file
require("dotenv").config({ path: "./secrets/.env" });

// Import required modules and libraries
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Import route handlers
const stripeRoutes = require("./src/stripe.js");

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

// Middleware to enable Cross-Origin Resource Sharing (CORS)
// Note: Change the origin later to the route from the gateway
app.use(cors({ origin: "*" }));
app.use(logMiddleware); // Log route and time
app.use("/", stripeRoutes); // Handle authentication routes

// Start the server
const PORT = process.env.PORT || 8003;
app.listen(process.env.PORT, () =>
  console.log(
    new Date().toLocaleTimeString() + `: Server is running on port ${PORT}...`,
  ),
);
