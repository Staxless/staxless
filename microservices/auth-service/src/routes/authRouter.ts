/**
 * @file authRouter.ts
 * @description Defines authentication-related routes including session validation and logout.
 * Utilizes Lucia for session management and cookie-based authentication.
 * 
 * Routes:
 *  - POST /auth/validate-request: Validates and refreshes the user session if valid.
 *  - POST /auth/logout: Logs out the user by invalidating the session.
 * 
 * @module authRouter
 */

import express, { Request, Response, NextFunction } from "express";
import { auth } from "../config/lucia-config";
import { parseCookies } from "oslo/cookie";

export const router = express.Router();

/**
 * Validates the user's session based on the `auth_session` cookie.
 * If the session is valid, a refreshed session cookie is returned.
 * If invalid or missing, responds with 401 and clears the session cookie.
 * 
 * @route POST /auth/validate-request
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response containing session info or an error message
 */
router.post("/auth/validate-request", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionId = parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;

    if (!sessionId) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { user, session } = await auth.validateSession(sessionId);

    if (session) {
      const sessionCookie = auth.createSessionCookie(session.id);
      res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      res.status(200).json({ message: "Session refreshed", user, session });
      return;
    }

    const sessionCookie = auth.createBlankSessionCookie();
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.status(401).json({ message: "Session not found" });
    return;
  } catch (error) {
    console.error("Error validating session:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

/**
 * Logs out the current user by invalidating their session and clearing the cookie.
 * Redirects to the frontend URL after logout.
 * 
 * @route POST /auth/logout
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Redirect response to frontend
 */
router.post("/auth/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionId = parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;

    if (!sessionId) {
      res.status(401).send("Unauthorized");
      return;
    }

    await auth.invalidateSession(sessionId);

    res.setHeader("Set-Cookie", auth.createBlankSessionCookie().serialize());
    res.redirect(process.env.FRONTEND_URL ?? "http://localhost:3000");
    return;
  } catch (error) {
    next(error);
  }
});

export default router;
