/**
 * @file oauthRouter.ts
 * @description Express router for handling OAuth authentication flows including:
 *  - Listing configured providers
 *  - Initiating login/registration flows
 *  - Handling provider callbacks to finalize authentication
 * 
 * This module integrates with configured OAuth providers and manages session creation
 * using Lucia authentication and secure cookies.
 * 
 * @module oauthRouter
 */

import express, { Request, Response } from "express";
import { auth } from "../config/lucia-config";
import { providers, getConfiguredProviders } from "../config/oauth-config";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { initializeOAuthFlow, getUserInfo, handleOAuthAction, handleError } from "../handlers/oauth-handlers";
import { Provider } from "../lib/providers/providerTypes";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * GET /providers
 * 
 * Returns a list of configured OAuth provider names (e.g., google, github).
 * 
 * @route GET /providers
 * @returns {object} JSON array of configured provider names.
 * @throws {500} On internal server error.
 */
router.get("/providers", (req: Request, res: Response) => {
  try {
    res.json(getConfiguredProviders());
  } catch (error) {
    console.error("Error getting configured providers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /login/:providerName
 * 
 * Initiates the OAuth login flow for the given provider.
 * 
 * @route GET /login/:providerName
 * @param {string} providerName - The name of the OAuth provider (e.g., google).
 * @returns {void} Redirects to provider's OAuth consent screen.
 */
router.get("/login/:providerName", initializeOAuthFlow("login"));

/**
 * GET /register/:providerName
 * 
 * Initiates the OAuth registration flow for the given provider.
 * 
 * @route GET /register/:providerName
 * @param {string} providerName - The name of the OAuth provider (e.g., github).
 * @returns {void} Redirects to provider's OAuth consent screen.
 */
router.get("/register/:providerName", initializeOAuthFlow("register"));

/**
 * GET /:providerName/callback
 * 
 * Handles the OAuth provider callback, validates the state, processes the user,
 * creates a session, and redirects to the frontend with appropriate path.
 * 
 * @route GET /:providerName/callback
 * @query {string} code - Authorization code from the provider.
 * @query {string} state - State parameter for CSRF protection.
 * @returns {void} Redirects to the frontend URL with session cookies set.
 * @throws {302} Redirects with error message on validation or provider failure.
 */
router.get("/:providerName/callback", async (req: Request, res: Response) => {
  const providerName = req.params.providerName.toLowerCase();
  const provider: Provider = providers[providerName];

  if (!provider || !provider.instance) {
    return res.redirect(`${FRONTEND_URL}/login?error=Invalid provider`);
  }

  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const cookies = parseCookies(req.headers.cookie ?? "");
  const storedState = cookies.get("oauth_state") ?? null;
  const oauthAction = cookies.get("oauth_action") ?? null;

  if (!code || !state || state !== storedState || !oauthAction) {
    return res.redirect(`${FRONTEND_URL}/login?error=Invalid state or action`);
  }

  try {
    const oauthUser = await getUserInfo(provider, code, req);
    const result = await handleOAuthAction(oauthAction, oauthUser, provider);

    // Clear temporary OAuth cookies
    const clearCookies = [
      serializeCookie("oauth_state", "", { maxAge: 0, path: "/" }),
      serializeCookie("oauth_action", "", { maxAge: 0, path: "/" }),
      serializeCookie("code_verifier", "", { maxAge: 0, path: "/" })
    ];

    const sessionCookie = auth.createSessionCookie(result.sessionId).serialize();
    res.setHeader("Set-Cookie", [sessionCookie, ...clearCookies]);

    res.redirect(`${FRONTEND_URL}/${result.redirectUrl}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    handleError(error, res);
  }
});

export default router as express.Router;
