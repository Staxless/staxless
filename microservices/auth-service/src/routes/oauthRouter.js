// auth-routes.js

/**
 * OAuth Authentication Routes
 *
 * This module defines routes for initiating and handling OAuth login and callback processes.
 * It supports multiple OAuth providers, allowing users to authenticate using their preferred service.
 * The routes are structured to:
 *   - Initiate the login process by redirecting users to the provider's authorization URL.
 *   - Handle the callback from the provider, validate the authorization code, and manage user sessions.
 *
 * @module auth-routes
 * @requires express
 * @requires providers from oauth-config.js
 * @requires handleLogin and handleCallback from oauth.js
 */

import express from "express";
import { providers } from "../config/oauth-config.js";
import { handleLogin, handleCallback } from "../lib/oauth.js";

const router = express.Router();

/**
 * Route handler for initiating the OAuth login process with a specified provider.
 *
 * @route GET /auth/login/:provider
 */
router.get("/auth/login/:provider", async (req, res, next) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];

  if (!provider) {
    return res.status(404).json({ error: "Provider not supported" });
  }

  provider.name = providerName; // Only set if provider exists

  try {
    await handleLogin(provider, req, res);
  } catch (error) {
    next(error); // Forward to centralized error handler
  }
});

/**
 * Route handler for processing the OAuth callback after user authorization.
 *
 * @route GET /auth/:provider/callback
 */
router.get("/auth/:provider/callback", async (req, res, next) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];

  if (!provider) {
    return res.status(404).json({ error: "Provider not supported" });
  }
  try {
    await handleCallback(provider, req, res);
  } catch (error) {
    next(error); // Forward to centralized error handler
  }
});

export default router;
