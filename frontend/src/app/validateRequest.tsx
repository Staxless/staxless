/**
 * @file validateRequest.ts
 * @description Retrieves user information from the auth service using session cookies
 * @module auth/getUser
 */

// External imports
import axios from "axios";

// Internal imports
import { cookies } from "next/headers";

/**
 * @description Represents a user session
 */
interface Session {
  fresh: boolean;
  expiresAt: Date;
}

/**
 * @description Represents a user
 */
interface User {
  username: string;
}

/**
 * @description Represents the session information returned by the auth service
 */
interface SessionInfo {
  data: {
    user: User;
    session: Session;
  };
}

/**
 * @description Retrieves the username of the authenticated user
 * @returns {Promise<string | null>} The username if authenticated, null otherwise
 */
export default async function getUser(): Promise<string | null> {
  const sessionCookie = cookies().get("auth_session") ?? null;
  if (!sessionCookie) return null;

  try {
    const response = await axios.post<SessionInfo>(
      "http://auth-service:8000/auth/validate-request",
      {},
      {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
      },
    );

    const { user, session } = response.data.data;
    if (session && user) {
      return user.username;
    }

    return null;
  } catch (error) {
    console.error("Error validating user session:", error);
    return null;
  }
}
