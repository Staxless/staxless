/*
  Description:
  This Node.js application handles authentication routes using Express.js.

  How to get started:
  1. Create a ".env" file in the "secrets" directory.
  2. Add your environment variables in the ".env" file.

  Routes:
  - GET /users/:username: Retrieves a user by username.
  - POST /users/register: Registers a new user.
*/

// Import required modules
const express = require("express");
const supabase = require("@supabase/supabase-js");
const axios = require("axios");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Corrected dotenv configuration

// Create Express router
const router = express.Router();

// Initialize Supabase client
const client = supabase.createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY,
);

/**
 * Route: Get user by username
 * GET /users/:username
 * @param {object} request - The request object.
 * @param {object} response - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user is retrieved.
 */
router.get("/:username", async (request, response) => {
  try {
    const { data, error } = await client
      .from("users")
      .select()
      .eq("username", request.params.username);
    if (error) {
      return response.status(500).send({ error });
    }
    return response.send(data[0]);
  } catch (error) {
    return response.status(500).send({ error });
  }
});

/**
 * Route: Register a new user
 * POST /users/register
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} JSON response indicating successful user creation.
 */
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const response = await axios.get(
      `http://db:8002/users/${req.body.username}`,
    );

    if (response.data != "") {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user to the database
    try {
      const { data, error } = await client.from("users").insert({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// Export the router
module.exports = router;
