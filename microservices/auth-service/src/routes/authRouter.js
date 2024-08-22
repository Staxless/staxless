// auth-routes.js
import { lucia } from "../config/lucia-config.js";
import express from "express";

const router = express.Router();

router.get("auth/validate-request", async (req, res) => {
  console.log("cookies", req);
  try {
    const sessionId = req.cookies[lucia.sessionCookieName];
    if (!sessionId) {
      return res.status(401).json({ message: "Session not found" });
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
      return res.status(401).json({ message: "Invalid session" });
    }

    if (session && session.fresh) {
      res.setHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error validating request:", error);
    return res.status(500).json({ message: "Internal server error" });
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
