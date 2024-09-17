import axios from "axios";
import { OAuth2RequestError, generateState } from "arctic";
import { lucia } from "../config/lucia-config.js";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { generateIdFromEntropySize } from "lucia";

/**
 * @file OAuth Handler
 * @description Handles OAuth login and callback operations, including generating the authorization URL,
 *              validating the state, retrieving user information, and managing user sessions.
 * @module oauthHandler
 */

/**
 * Handles OAuth login by generating the authorization URL and redirecting the user.
 *
 * @param {Object} provider - The OAuth provider instance.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function handleLogin(provider, req, res) {
  try {
    const state = generateState();
    const url = await provider.createAuthorizationURL(state, provider.scopes);

    // Set the OAuth state cookie
    const cookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production", // Set to true in production
      httpOnly: false,
      maxAge: 60 * 10 * 1000, // 10 minutes in milliseconds
      sameSite: "Lax",
    };

    // Set the cookie
    res.cookie("oauth_state", state, cookieOptions);

    // Redirect the user to the OAuth provider's authorization URL
    res.redirect(url.toString());
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

/**
 * Fetches the user's information from the OAuth provider using the authorization code.
 *
 * @param {Object} provider - The OAuth provider instance.
 * @param {string} code - The authorization code received from the OAuth provider.
 * @returns {Object} The user's information from the OAuth provider.
 */
async function getUserInfo(provider, code) {
  const tokens = await provider.validateAuthorizationCode(code);
  const oauthUserResponse = await axios.get(provider.userInfoUrl, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  return oauthUserResponse.data;
}

/**
 * Finds an existing session for the given user ID.
 *
 * @param {string} userId - The user ID for which to find the session.
 * @returns {Object|null} The existing session, or null if not found.
 */
async function findExistingSession(userId) {
  const existingSession = await lucia.adapter.Session.findOne({
    user_id: userId,
  });

  if (existingSession) {
    const { session } = await lucia.validateSession(existingSession._id);
    if (!session.fresh) {
      return await lucia.invalidateSession(session.id);
    }
    return false;
  }
}

/**
 * Finds an existing user by their OAuth account, or creates a new user and account.
 *
 * @param {Object} oauthUser - The OAuth user information.
 * @param {Object} provider - The OAuth provider instance.
 * @returns {Object} The user object with the user ID.
 */
async function findOrCreateUser(oauthUser, provider) {
  // Check if the OAuth account already exists
  const accountResponse = await lucia.adapter.OauthAccount.findOne({
    provider_user_id: oauthUser.id.toString(),
  });

  if (accountResponse) {
    // Return the existing user if found
    const userResponse = await lucia.adapter.User.findOne({
      _id: accountResponse.user_id,
    });
    if (userResponse) return userResponse;
  }

  // Create a new user and account if not found
  const userId = generateIdFromEntropySize(10);
  await lucia.adapter.User.insertOne({
    name: oauthUser.login,
    _id: userId.toString(),
    roles: ["user"],
    created_at: new Date(),
  });

  await lucia.adapter.OauthAccount.insertOne({
    provider_id: provider.name,
    provider_user_id: oauthUser.id.toString(),
    user_id: userId.toString(),
  });

  return { _id: userId.toString() };
}

/**
 * Handles the OAuth callback, including validating the state, retrieving user info,
 * finding or creating a user and session, and managing redirects.
 *
 * @param {Object} provider - The OAuth provider instance.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function handleCallback(provider, req, res) {
  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState =
    parseCookies(req.headers.cookie ?? "").get("oauth_state") ?? null;

  // Validate the state and authorization code
  if (!code || !state || state !== storedState) {
    return res.status(400).send("Invalid state");
  }

  try {
    // Retrieve user information from the OAuth provider
    const oauthUser = await getUserInfo(provider, code);

    // Find or create a user and account
    const userResponse = await findOrCreateUser(oauthUser, provider);

    // Check for an existing session for the user
    const existingSession =
      (await findExistingSession(userResponse._id)) ?? null;

    if (!existingSession) {
      const session = await lucia.createSession(userResponse._id, {});
      const sessionCookie = lucia.createSessionCookie(session.id).serialize();
      res.cookie(sessionCookie);
      return res.redirect("http://localhost:3000/");
    }

    if (existingSession && existingSession.fresh) {
      const sessionCookie = lucia
        .createSessionCookie(existingSession._id)
        .serialize();
      res.cookie(sessionCookie);
      return res.redirect("http://localhost:3000/dashboard");
    }
  } catch (error) {
    handleError(error, res); // Handle any errors that occur during the process
  }
}

/**
 * Handles errors during the OAuth process, providing specific error messages where applicable.
 *
 * @param {Error} error - The error object caught during the process.
 * @param {Object} res - The HTTP response object.
 */
const handleError = (error, res) => {
  if (
    error instanceof OAuth2RequestError &&
    error.message === "bad_verification_code"
  ) {
    return res.status(400).send("Bad verification code");
  }

  res.status(500).send("Internal Server Error");
};
