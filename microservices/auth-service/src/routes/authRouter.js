import { lucia } from "../config/lucia-config.js";
import express from "express";
import { parseCookies } from "oslo/cookie";

const router = express.Router();

/**
 * Route handler for validating the user's session.
 *
 * @route GET /auth/validate-request
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the session is validated.
 */
router.post("/auth/validate-request", async (req, res, next) => {
  try {
    const sessionId =
      parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;
    if (!sessionId) {
      return res.status(401).send("Unauthorized");
    }

    const { user, session } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
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

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return res.status(401).json({ message: "Session not found" });
    } else {
      res.user = user;
      res.session = session;
      return res.status(200).json({ message: "Valid Session" });
    }
    next(); // Proceed to the next middleware or route handler if necessary
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Route handler for logging out the current user by invalidating their session.
 *
 * @route POST /auth/logout
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 */
router.post("/auth/logout", async (req, res) => {
  const sessionId =
    parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;
  if (!sessionId) {
    return res.status(401).send("Unauthorized");
  }
  await lucia.invalidateSession(sessionId);

  return res.setHeader(
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize(),
  );
});

export default router;
