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
function isWithinExpirationDate(date) {
  return Date.now() < date.getTime();
}

function createDate(timeSpan) {
  return new Date(Date.now() + timeSpan.milliseconds());
}

async function validateSession(sessionId) {
  try {
    // Fetch the session and user from the adapter
    const [databaseSession, databaseUser] =
      await lucia.adapter.getSessionAndUser(sessionId);

    // Check if session or user does not exist
    if (!databaseSession) {
      return { session: null, user: null };
    }
    if (!databaseUser) {
      await lucia.adapter.deleteSession(databaseSession.id);
      return { session: null, user: null };
    }

    // Check if session is expired
    if (!isWithinExpirationDate(databaseSession.expiresAt)) {
      await lucia.adapter.deleteSession(databaseSession.id);
      return { session: null, user: null };
    }

    // Calculate the active period expiration date
    const activePeriodExpirationDate = new Date(
      databaseSession.expiresAt.getTime() -
        lucia.sessionExpiresIn.milliseconds() / 2,
    );

    // Prepare the session object
    const session = {
      ...lucia.getSessionAttributes(databaseSession.attributes),
      id: databaseSession.id,
      userId: databaseSession.userId,
      fresh: false,
      expiresAt: databaseSession.expiresAt,
    };

    // Check if the session is fresh
    if (isWithinExpirationDate(activePeriodExpirationDate)) {
      session.fresh = true;
      session.expiresAt = createDate(lucia.sessionExpiresIn);
      await lucia.adapter.updateSessionExpiration(
        databaseSession.id,
        session.expiresAt,
      );
    }

    // Prepare the user object
    const user = {
      ...lucia.getUserAttributes(databaseUser.attributes),
      id: databaseUser.id,
    };

    return { user, session };
  } catch (err) {
    throw err; // Re-throw the error after logging it
  }
}

router.post("/auth/validate-request", async (req, res, next) => {
  try {
    const sessionId =
      parseCookies(req.headers.cookie ?? "").get("auth_session") ?? null;
    if (!sessionId) {
      return res.status(401).send("Unauthorized");
    }

    const { user, session } = await validateSession(sessionId);

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
      return res.status(401).json({ message: "Session not found" });
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
