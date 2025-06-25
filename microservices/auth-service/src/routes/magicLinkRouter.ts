/**
 * @file magic-link-router.ts
 * @description Express router for handling magic link authentication flows including:
 *  - Initiating login/registration flows
 *  - Handling magic link callbacks to finalize authentication
 * 
 * This module integrates with the magic link configuration and manages session creation
 * using Lucia authentication and secure cookies.
 * 
 * @module magicLinkRouter
 */

import express, { NextFunction, Request, Response } from "express";
import { initializeMagicLinkFlow, validateMagicLink, handleError } from "../handlers/magic-link-handlers";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { magicLinkProvider } from "../config/magic-link-config";
import { auth } from "../config/lucia-config";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


/**
 * GET /magic-link/login
 * 
 * Initiates the magic link login flow.
 * 
 * @route GET /magic-link/login
 * @returns {void} Returns state for client-side handling or redirects on error.
 */
router.post("/magic-link/login", initializeMagicLinkFlow("login"));

/**
 * GET /magic-link/register
 * 
 * Initiates the magic link registration flow.
 * 
 * @route GET /magic-link/register
 * @returns {void} Returns state for client-side handling or redirects on error.
 */
router.post("/magic-link/register", initializeMagicLinkFlow("register"));

/**
 * GET /magic-link/callback
 * 
 * Handles the magic link callback, validates the token, creates a session, and redirects to the frontend.
 * 
 * @route GET /magic-link/callback
 * @query {string} token - The magic link token.
 * @query {string} state - State parameter for CSRF protection.
 * @returns {void} Redirects to the frontend URL with session cookies set.
 * @throws {302} Redirects with error message on validation failure.
 */
router.get("/magic-link/callback", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, state } = req.query;
    const cookies = parseCookies(req.headers.cookie ?? "");
    const storedState = cookies.get("magic_state") ?? null;
    const magicAction = cookies.get("magic_action") ?? null;

     
     

    if (!token || !state || state !== storedState || !magicAction) {
       
      return res.redirect(`${FRONTEND_URL}/login?error=Invalid token or state`);
    }

    try {
      const sessionId = await magicLinkProvider.validateMagicLink(token.toString());
       
      const sessionCookie = auth.createSessionCookie(sessionId).serialize();
      const clearCookies = [
        serializeCookie("magic_state", "", { maxAge: 0, path: "/" }),
        serializeCookie("magic_action", "", { maxAge: 0, path: "/" }),
      ];

       
      res.setHeader("Set-Cookie", [sessionCookie, ...clearCookies]);
       
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('Error in validateMagicLink:', error);
      handleError(error, res);
    }
});

export default router as express.Router;
