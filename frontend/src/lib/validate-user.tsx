/**
 * @file User Authentication Utility
 * @module auth
 * @description Provides utility functions for user authentication and session validation.
 */

"use server"
import { cookies } from "next/headers";

/**
 * @interface User
 * @description Represents a user object with authentication and subscription information
 */
export interface User {
  id: string;
  email: string;
  subscription: {type: String, startDate: Date},
  roles: string[];
  // Add any other properties that your user object might have
}

/**
 * Retrieves the authenticated user's data by validating the session cookie.
 *
 * @returns {Promise<User | null>} A promise that resolves to the user object if authenticated, or null if not
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session");
  if (!sessionCookie) return null;

  try {
    const response = await fetch(
      "http://front-gate:8000/auth/validate-request",
      {
        method: "POST",
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: "no-store",
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    if (data.session) {
      return data.user as User;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:");
    return null;
  }
}
