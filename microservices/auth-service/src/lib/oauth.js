import axios from "axios";
import { OAuth2RequestError, generateState } from "arctic";
import { lucia } from "../config/lucia-config.js";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { generateIdFromEntropySize } from "lucia";

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
    const url = await provider.createAuthorizationURL(state);

    res.appendHeader(
      "Set-Cookie",
      serializeCookie("oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
      }),
    );
    res.redirect(url.toString());
  } catch (error) {
    console.error("Error handling login:", error);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * Handles OAuth callback by validating the authorization code and creating a user session.
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

  if (!code || !state || state !== storedState) {
    return res.status(400).send("Invalid state");
  }

  try {
    const tokens = await provider.validateAuthorizationCode(code);
    const oauthUserResponse = await axios.get(provider.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const oauthUser = oauthUserResponse.data;
    const userId = generateIdFromEntropySize(10);
    let user;

    try {
      const userResponse = await axios.get("http://user-service:8002/", {
        params: {
          id: oauthUser.id,
          username: oauthUser.login,
        },
      });

      user = userResponse.data.user;

      if (!user) {
        throw new Error("User not found");
      }
    } catch {
      console.log("User not found, creating a new user...");

      try {
        const createUserResponse = await axios.post(
          "http://user-service:8002/",
          {
            name: oauthUser.login,
            id: userId,
          },
        );
        user = createUserResponse.data;
      } catch (creationError) {
        console.error("Error creating user:", creationError);
        return res.status(500).send("Failed to create user");
      }
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();
    res
      .appendHeader("Set-Cookie", sessionCookie)
      .redirect("http://localhost:3000/dashboard");
  } catch (error) {
    handleError(error, res);
  }
}

const handleError = (error, res) => {
  if (
    error instanceof OAuth2RequestError &&
    error.message === "bad_verification_code"
  ) {
    console.log("OAuth2 Request Error:", error);
    return res.status(400).send("Bad verification code");
  }

  console.error("Internal Server Error:", error);
  res.status(500).send("Internal Server Error");
};
