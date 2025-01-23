/**
 * @file authRoutes.js
 * @description Handles user authentication processes including session validation, logout, and session cookie management.
 * @module authRoutes
 */

import { lucia } from "../config/lucia-config.js";
import express from "express";
import { parseCookies } from "oslo/cookie";

const router = express.Router();

/**
 * Validates the user's session and refreshes it if valid.
 * @route POST /auth/validate-request
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the session is validated.
 * @description Checks for a valid session by reading the session cookie. If a valid session is found,
 *              it refreshes the session and returns user details. If the session is invalid, it returns a 401 Unauthorized response.
 */
router.post("/auth/validate-request", async (req, res, next) => {
  try {
    const sessionId =
      parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;

    if (!sessionId) {
      return res.status(401).send("Unauthorized");
    }

    const { user, session } = await lucia.validateSession(sessionId);

    if (session) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      res.user = user;
      res.session = session;
      return res
        .status(200)
        .json({ message: "Session refreshed", user, session });
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    res.cookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return res.status(401).json({ message: "Session not found" });
  } catch (error) {
    return res.status(500).send("Internal Server Error",error);
  }
});

/**
 * Logs out the current user by invalidating their session.
 * @route POST /auth/logout
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 * @description Invalidates the user's session by calling `lucia.invalidateSession`. It then clears the session cookie
 *              and redirects the user to the homepage (or login page).
 */
router.post("/auth/logout", async (req, res) => {
  const sessionId =
    parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;
  if (!sessionId) {
    return res.status(401).send("Unauthorized");
  }

  await lucia.invalidateSession(sessionId);

  res.setHeader("Set-Cookie", lucia.createBlankSessionCookie());
 
  return res
  .status(200)
  .redirect("http://frontend:3000/"); //FIXME: This need to be dynamic based on host.
});

export default router;
