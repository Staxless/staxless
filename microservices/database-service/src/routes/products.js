/*
  Description:
  This Node.js application handles product-related routes using Express.js and Supabase for database operations.

  How to get started:
  1. Create a ".env" file in the "secrets" directory with the following environment variables:
     - DATABASE_URL: Your Supabase database URL
     - DATABASE_KEY: Your Supabase database key
  2. Add your environment variables in the ".env" file.

  Routes:
  - GET /products/:id: Retrieves a product by its ID.
  - GET /products: Retrieves all products.
*/

// Import required modules
const express = require("express");
const supabase = require("@supabase/supabase-js");
require("dotenv").config("./secrets/");
const router = express.Router();
const axios = require("axios");

// Initialize Supabase client
const client = supabase.createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY,
);

/**
 * Retrieves a product by its ID.
 * GET /products/:id
 * @param {object} request - The request object.
 * @param {object} response - The response object.
 * @returns {Promise<void>} A Promise that resolves when the product is retrieved.
 */
router.get("/:id", async (request, response) => {
  try {
    const { data, error } = await client
      .from("products")
      .select()
      .eq("id", request.params.id);
    console.log(data);
    return response.send(data);
  } catch (error) {
    return response.send({ error });
  }
});

/**
 * Retrieves all products
 * GET /products
 * @param {object} request - The request object.
 * @param {object} response - The response object.
 * @returns {Promise<void>} A Promise that resolves when the product is retrieved.
 */
router.get("/", async (request, response) => {
  try {
    const { data, error } = await client.from("products").select();
    console.log(data);
    return response.send(data);
  } catch (error) {
    return response.send({ error });
  }
});

// Export the router
module.exports = router;
