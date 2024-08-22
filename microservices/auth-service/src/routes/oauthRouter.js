// auth-routes.js
import express from "express";
import { providers } from "../config/oauth-config.js";
import { handleLogin, handleCallback } from "../lib/oauth.js";

const router = express.Router();

/**
 * Route handler for initiating the OAuth login process with a specified
 * provider.
 *
 * @route GET /auth/login/:provider
 * @param {string} provider - The name of the OAuth provider to use.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the login process
 *   is handled.
 */
router.get("/auth/login/:provider", async (req, res) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];
  if (!provider) {
    return res.status(404).json({ error: "Provider not supported" });
  }
  try {
    await handleLogin(provider, req, res);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route handler for processing the OAuth callback after user authorization.
 *
 * @route GET /auth/:provider/callback
 * @param {string} provider - The name of the OAuth provider.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the callback process
 *   is handled.
 */
router.get("/auth/:provider/callback", async (req, res) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];
  if (!provider) {
    return res.status(404).json({ error: "Provider not supported" });
  }
  try {
    await handleCallback(provider, req, res);
  } catch (error) {
    console.error("Error during callback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route handler for logging out the current user by invalidating their
 * session.
 *
 * @route POST /auth/logout
 * @param {Object} _ - The HTTP request object (not used).
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged
 *   out and redirected.
 */
router.post("/auth/logout", async (_, res) => {
  if (!res.locals.session) {
    return res.status(401).end();
  }
  await lucia.invalidateSession(res.locals.session.id);
  return res
    .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    .redirect("/login");
});

export default router;
