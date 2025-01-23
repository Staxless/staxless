/**
 * @file Logout Server Action
 * @module logoutAction
 * @description A server action to handle user logout by invalidating the auth session.
 */

"use server";

import { cookies } from "next/headers";
import axios from "axios";

/**
 * @interface LogoutResult
 * @description Represents the result of a logout operation
 * @property {boolean} success - Indicates whether the logout was successful
 * @property {string} [error] - Error message if the logout failed
 */
interface LogoutResult {
  success: boolean;
  error?: string;
}

/**
 * Logs out the user by invalidating the auth session.
 *
 * This function performs the following steps:
 * 1. Retrieves the auth session cookie
 * 2. Sends a logout request to the auth service
 * 3. Deletes the auth session cookie if logout is successful
 *
 * @returns {Promise<LogoutResult>} A promise that resolves to the result of the logout operation
 */
export async function logout(): Promise<LogoutResult> {
  const cookieStore = await cookies();
  const authSession = cookieStore.get("auth_session");

  if (!authSession) {
    console.error("Auth session cookie not found");
    return { success: false, error: "Auth session not found" };
  }

  try {
    const response = await axios.post(
      "http://front-gate:8000/auth/logout",
      {},
      {
        headers: {
          Cookie: `auth_session=${authSession.value}`,
        },
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      cookieStore.delete("auth_session");
      return { success: true };
    } else {
      console.error("Sign out failed");
      return { success: false, error: "Sign out failed" };
    }
  } catch (error) {
    console.error("Error during sign out:", error);
    return { success: false, error: "Error during sign out" };
  }
}
