/*
  Description:
  This Node.js application handles authentication routes using Express.js,
  JWT for token generation, bcrypt for password hashing, and axios for HTTP requests.

  How to get started:
  1. Create a ".env" file in the "secrets" directory.
  2. Add your environment variables in the ".env" file.

  Routes:
  - POST /auth/login: Route to authenticate user and generate JWT tokens.
  - POST /auth/logout: Route to logout user.
  - GET /auth/validate-token: Route to check if the user is authenticated.
  - POST /auth/generate-access-token: Route to generate a new access token using a valid refresh token.
*/

// Import required modules
require("dotenv").config("./secrets/");
const express = require("express");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Configure middleware
router.use(bodyParser.json()); // Parse request bodies as JSON
router.use(cookieParser()); // Parse cookies

// Load JWT secret key from environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Middleware to verify JWT token in request cookies.
 * Adds decoded user information to request object if token is valid.
 */
function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    req.user = user;
    next();
  });
}

/**
 * Route: Authenticate user and generate JWT tokens.
 * POST /auth/login
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} JSON response indicating successful login.
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Fetch user data from database service
    const response = await axios.get(`http://db:8002/users/${username}`, {
      responseType: "json",
    });
    const user = response.data;

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set tokens as cookies in the response
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route: Logout user.
 * POST /auth/logout
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} JSON response indicating successful logout.
 */
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});

/**
 * Route: Check if user is authenticated.
 * GET /auth/validate-token
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} JSON response indicating user authentication status.
 */
router.get("/validate-token", authenticateToken, (req, res) => {
  res.status(200).json({ message: "User is authenticated", user: req.user });
});

/**
 * Route: Generate a new access token using a valid refresh token.
 * POST /auth/generate-access-token
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} JSON response with a new access token.
 */
router.post("/generate-access-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token is missing or invalid" });
  }

  jwt.verify(refreshToken, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ userId: user.userId }, JWT_SECRET_KEY, {
      expiresIn: "15m",
    });
    res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true });
    res.status(200).json({
      message: "New access token generated",
      accessToken: newAccessToken,
    });
  });
});

module.exports = router; // Export the router for use in other modules
