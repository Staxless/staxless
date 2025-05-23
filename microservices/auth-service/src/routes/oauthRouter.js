import express from "express";
import axios from "axios";
import { OAuth2RequestError } from "arctic";
import { lucia } from "../config/lucia-config.js";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { providers, getConfiguredProviders } from "../config/oauth-config.js";
import crypto from "crypto";
import { generateIdFromEntropySize } from "lucia";

const router = express.Router();

/**
 * Generates a CSRF token for security purposes.
 * @returns {string} A randomly generated CSRF token.
 */
const generateCSRFToken = () => crypto.randomBytes(32).toString("hex");

/**
 * Middleware to check CSRF token validity.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const csrfProtection = (req, res, next) => {
  const csrfCookie = parseCookies(req.headers.cookie ?? "").get("csrf_token");
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: "CSRF token validation failed" });
  }
  next();
};

/**
 * Initializes the OAuth flow for registration or login.
 * @param {string} action - The action to perform ('register' or 'login').
 * @returns {Function} An async Express route handler.
 */
const initializeOAuthFlow = (action) => async (req, res) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];

  if (!provider || !provider.instance) {
    return res.status(400).json({ error: "Provider not supported" });
  }

  try {
    const state = crypto.randomBytes(16).toString("hex");
    const url = await provider.instance.createAuthorizationURL(state, provider.scopes);

    const cookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10 * 1000, // 10 minutes
      sameSite: "Lax",
    };

    const csrfToken = generateCSRFToken();

    res
      .cookie("oauth_state", state, cookieOptions)
      .cookie("oauth_action", action, cookieOptions)
      .cookie("csrf_token", csrfToken, { ...cookieOptions, httpOnly: false })
      .status(300)
      .redirect(url.href);
  } catch (error) {
    console.error(`OAuth ${action} error:`, error);
    res
      .status(500)
      .json({ error: `Failed to create authorization URL for ${action}` });
  }
};

// Route definitions
router.post("/auth/register", csrfProtection, (req, res) => {
  res.redirect(`/auth/register/${req.body.provider}`);
});

router.get("/auth/register/:provider", initializeOAuthFlow("register"));

router.get("/auth/login/:provider", initializeOAuthFlow("login"));

router.post("/auth/register/:provider", initializeOAuthFlow("register"));

router.post("/auth/login/:provider", initializeOAuthFlow("login"));

/**
 * Handles the OAuth callback after user authorization.
 * @route GET /auth/:provider/callback
 */
router.get("/auth/:provider/callback", async (req, res) => {
  const providerName = req.params.provider;
  const provider = providers[providerName];

  if (!provider || !provider.instance) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://frontend:3000"}/login?error=Invalid provider`);
  }

  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const cookies = parseCookies(req.headers.cookie ?? "");
  const storedState = cookies.get("oauth_state") ?? null;
  const oauthAction = cookies.get("oauth_action") ?? null;

  if (!code || !state || state !== storedState) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://frontend:3000"}/login?error=Invalid state`);
  }

  try {
    const oauthUser = await getUserInfo(provider, code);
    oauthUser.fname = oauthUser.name?.split(" ")[0] || oauthUser.given_name || "";
    oauthUser.lname = oauthUser.name?.split(" ")[1] || oauthUser.family_name || "";

    const result = await handleOAuthAction(oauthAction, oauthUser, provider);

    const sessionCookie = lucia.createSessionCookie(result.sessionId).serialize();
    res.setHeader("Set-Cookie", [
      sessionCookie,
      serializeCookie("oauth_state", "", { maxAge: 0 }),
      serializeCookie("oauth_action", "", { maxAge: 0 }),
      serializeCookie("csrf_token", "", { maxAge: 0 }),
    ]);

    const redirectUrl = `${process.env.FRONTEND_URL || "http://frontend:3000"}/${result.redirectUrl}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Retrieves user information from the OAuth provider.
 * @param {Object} provider - The OAuth provider configuration.
 * @param {string} code - The authorization code.
 * @returns {Promise<Object Patent Response Object} The user information.
 */
async function getUserInfo(provider, code) {
  if (!code) throw new Error("Authorization code missing");
  if (!provider.instance) throw new Error("Provider instance not configured");

  try {
    const tokens = await provider.instance.validateAuthorizationCode(code);
    const userResponse = await axios.get(provider.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    return userResponse.data;
  } catch (error) {
    console.error(`Failed to fetch user info from ${provider.name}:`, error);
    throw error instanceof OAuth2RequestError ? error : new Error("Failed to retrieve user information");
  }
}

/**
 * Handles the OAuth action (registration or login).
 * @param {string} action - The OAuth action ('register' or 'login').
 * @param {Object} oauthUser - The user information from the OAuth provider.
 * @param {Object} provider - The OAuth provider object.
 * @returns {Promise<Object>} The result of the action.
 */
async function handleOAuthAction(action, oauthUser, provider) {
  
  switch (action) {
    case "register":
      return handleRegistration(oauthUser, provider);
    case "login":
      return handleLogin(oauthUser, provider);
    default:
      throw new Error("Invalid OAuth action");
  }
}

/**
 * Handles user registration via OAuth.
 * @param {Object} oauthUser - The user information from the OAuth provider.
 * @param {Object} provider - The OAuth provider object.
 * @returns {Promise<Object>} The registration result.
 */
async function handleRegistration(oauthUser, provider) {
  const existingUser = await findOAuthAccount(oauthUser.id || oauthUser.sub, provider.name);
  if (existingUser) {
    throw new Error("OAuth account already in use. Please login.");
  }
  console.log("Creating new user");
  console.log("provider", provider);

  const userId = crypto.randomUUID();
  const newUser = {
    _id: userId.toString(),
    first_name: oauthUser.fname || "",
    last_name: oauthUser.lname || "",
    email: oauthUser.email || "",
    avatar: oauthUser.picture || "",
    created_at: new Date(),
    subscription: {
      type: "free",
      startDate: new Date(),
    },
    roles: ["user"],
  };

  await lucia.adapter.User.insertOne(newUser);
  await createOAuthAccount(userId, oauthUser.id || oauthUser.sub, provider.name);

  const session = await lucia.createSession(userId, {});
  return { sessionId: session.id, redirectUrl: "http://frontend:3000/checkout" };
}

/**
 * Handles user login via OAuth.
 * @param {Object} oauthUser - The user information from the OAuth provider.
 * @param {Object} provider - The OAuth provider object.
 * @returns {Promise<Object>} The login result.
 */
async function handleLogin(oauthUser, provider) {
  const oauthAccount = await findOAuthAccount(oauthUser.id || oauthUser.sub, provider.name);
  if (!oauthAccount) {
    throw new Error("No account found. Please register.");
  }

  const session = await lucia.createSession(oauthAccount.user_id, {});
  return { sessionId: session.id, redirectUrl: "dashboard" };
}

/**
 * Creates an OAuth account for a user.
 * @param {string} userId - The user's ID.
 * @param {string} providerUserId - The user's ID from the OAuth provider.
 * @param {string} providerId - The OAuth provider's ID.
 * @returns {Promise<void>}
 */
async function createOAuthAccount(userId, providerUserId, providerId) {
  await lucia.adapter.OauthAccount.insertOne({
    provider_id: providerId,
    provider_user_id: providerUserId,
    user_id: userId,
  });
}

/**
 * Finds an OAuth account.
 * @param {string} providerUserId - The user's ID from the OAuth provider.
 * @param {string} providerId - The OAuth provider's ID.
 * @returns {Promise<Object|null>} The OAuth account if found, null otherwise.
 */
async function findOAuthAccount(providerUserId, providerId) {
  return await lucia.adapter.OauthAccount.findOne({
    provider_id: providerId,
    provider_user_id: providerUserId,
  });
}

/**
 * Handles errors in the OAuth process.
 * @param {Error} error - The error object.
 * @param {Object} res - Express response object.
 */
const handleError = (error, res) => {
  const redirectBase = process.env.FRONTEND_URL || "http://frontend:3000";
  if (error instanceof OAuth2RequestError && error.message === "bad_verification_code") {
    return res.redirect(`${redirectBase}/login?error=Bad verification code`);
  }

  console.error("OAuth error:", error);
  return res.redirect(
    `${redirectBase}/login?error=${encodeURIComponent(error.message || "An unexpected error occurred")}`,
  );
};

/**
 * Retrieves the list of configured OAuth providers.
 * @route GET /auth/providers
 */
router.get("/auth/providers", (req, res) => {
  try {
    const configuredProviders = getConfiguredProviders();
    res.setHeader("Content-Type", "application/json");
    res.json(configuredProviders);
  } catch (error) {
    console.error("Error getting configured providers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;