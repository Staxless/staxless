/**
 * @file oauth-handler.js
 * @description Handles OAuth login, registration, callback operations, including generating the authorization URL,
 *              validating the state, retrieving user information, and managing user sessions.
 * @module oauthHandler
 */

import axios from "axios";
import { OAuth2RequestError, generateState } from "arctic";
import { lucia } from "../config/lucia-config.js";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { generateIdFromEntropySize } from "lucia";

/**
 * Handles user registration and initiates OAuth login.
 *
 * @param {Object} provider - The OAuth provider instance.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function handleRegister(provider, req, res) {
  try {
    console.log(req.body);
    const { firstName, lastName, email } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send("Email already in use. Please login.");
    } else {
      const userId = generateIdFromEntropySize(12);
      const newUser = {
        _id: userId,
        firstname: firstName,
        lastname: lastName,
        email: email,
        created_at: new Date(),
        subscription: "free",
        roles: ["user"],
      };
      await lucia.adapter.User.insertOne(newUser);
      handleLogin(provider, req, res);
    }
  } catch (error) {
    console.log("Register error", error);
    return res
      .status(400)
      .send("An unexpected error occurred during registration");
  }
}

/**
 * Handles OAuth login for existing users.
 *
 * @param {Object} provider - The OAuth provider instance.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function handleLogin(provider, req, res) {
  const state = generateState();
  try {
    const url = await provider.createAuthorizationURL(state, provider.scopes);

    const cookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      maxAge: 60 * 10 * 1000, // 10 minutes in milliseconds
      sameSite: "Lax",
    };

    res.cookie("oauth_state", state, cookieOptions);

    res.redirect(url.toString());
  } catch (error) {
    console.log("oauthlogin error:", error);

    error.message = "Failed to create authorization URL";
    error.status = 500;
    throw error;
  }
}

/**
 * Handles the OAuth callback for both login and registration.
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
  const userId = parseCookies(req.headers.cookie ?? "").get("user_id") ?? null;
  console.log(req.headers.cookie);

  if (!code || !state || state !== storedState) {
    return res.redirect("/auth?error=Invalid state");
  }

  try {
    const oauthUser = await getUserInfo(provider, code);

    await findOrCreateOAuthAccount(userId, oauthUser.id, provider.id);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();

    res.setHeader("Set-Cookie", sessionCookie);
    res.redirect("http://fontend:3000/dashboard");
  } catch (error) {
    handleError(error, res);
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
 * Finds a user by their email address.
 *
 * @param {string} email - The user's email address.
 * @returns {Object|null} The user object if found, null otherwise.
 */
async function findUserByEmail(email) {
  return await lucia.adapter.User.findOne({ email });
}

/**
 * Finds or creates an OAuth account for a user.
 *
 * @param {string} userId - The user's ID.
 * @param {string} providerUserId - The user's ID from the OAuth provider.
 * @param {string} providerId - The OAuth provider's ID.
 */
async function findOrCreateOAuthAccount(userId, providerUserId, providerId) {
  const existingAccount = await lucia.adapter.OauthAccount.findOne({
    provider_id: providerId,
    provider_user_id: providerUserId,
  });

  if (!existingAccount) {
    await lucia.adapter.OauthAccount.insert({
      provider_id: providerId,
      provider_user_id: providerUserId,
      user_id: userId,
    });
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
    return res.redirect("/auth/login?error=Bad verification code");
  }

  console.error("OAuth error:", error);
  res.redirect("/auth/login?error=An unexpected error occurred");
};
