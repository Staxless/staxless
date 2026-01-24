/**
 * @file User Authentication Utility
 * @module auth
 * @description Provides utility functions for user authentication and session validation.
 */
'use server';

import { cookies } from 'next/headers';
import {
  type ActionResult,
  success,
  failure,
  safeFetch,
  logError,
} from '@/lib/error-handling';
import { getApiGatewayUrl } from '@/lib/api-config';

/**
 * @interface User
 * @description Represents a user object with authentication and subscription information
 */
export interface User {
  id: string;
  email: string;
  roles: string[];
  subscription: {
    type: string;
    startDate: Date;
    status: string;
  };
}

/**
 * Retrieves the authenticated user's data by validating the session cookie.
 *
 * @returns {Promise<ActionResult<User>>} A promise that resolves to the user object if authenticated
 */
export async function getUser(): Promise<ActionResult<User>> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
      return failure('No session cookie found. Please log in.');
    }

    interface ValidateResponse {
      session: unknown;
      user: User;
    }

    const data = await safeFetch<ValidateResponse>(
      `${getApiGatewayUrl()}/auth/validate-request`,
      {
        method: 'POST',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    if (data.session) {
      return success(data.user);
    }

    return failure('Invalid session. Please log in again.');
  } catch (error) {
    logError(error, { action: 'getUser' });
    return failure('Failed to validate user session. Please log in again.');
  }
}