// server.js

/*
  Description: Entry point for the Stripe API microservice.

  How to get started:
  - Add products to Supabase database.
  - Set the following environment variables in your .env file:
    - PORT: The port number for the server to listen on.
    - STRIPE_PRIVATE_KEY: The API key you get from your Stripe Account.
    - CLIENT_URL: Your checkout URL.
*/

// Load environment variables from .env file
require("dotenv").config({ path: "./secrets/.env" });

// Import required modules and libraries
const express = require("express");
const cors = require("cors");

// Import route handlers
const stripeRoutes = require("./src/stripe.js");

// Initialize the Express application
const app = express();

// Middleware to log route and time
app.use((req, res, next) => {
  console.log(
    `Route: ${req.originalUrl} | Time: ${new Date().toLocaleString()}`,
  );
  next();
});

// Middleware to enable CORS
app.use(cors({ origin: "http://back-gate:8080/" }));

// Use Stripe routes
app.use("/", stripeRoutes);

// Start the server
const PORT = process.env.PORT || 8003;
app.listen(PORT, () =>
  console.log(
    `${new Date().toLocaleTimeString()}: Server is running on port ${PORT}...`,
  ),
);
