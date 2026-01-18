/**
 * @file User Authentication Utility
 * @module auth
 * @description Provides utility functions for user authentication and session validation.
 */
'use server';

import { cookies } from 'next/headers';

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
 * @returns {Promise<User | null>} A promise that resolves to the user object if authenticated, or null if not
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');

  console.log('[getUser] Session cookie:', sessionCookie?.value ? 'exists' : 'missing');

  if (!sessionCookie) {
    return null;
  }

  try {
    console.log('[getUser] Calling validate-request...');
    
    const response = await fetch(
      'http://kong-api-gateway:8000/auth/validate-request',
      {
        method: 'POST',
        headers: {
          Cookie: `auth_session=${sessionCookie.value}`,
        },
        cache: 'no-store',
      }
    );

    console.log('[getUser] Response status:', response.status);

    if (!response.ok) {
      console.error('[getUser] Validation failed:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('[getUser] Validation succeeded, user:', data.user?.id);
    
    if (data.session) {
      return data.user as User;
    }
    
    return null;
  } catch (error) {
    console.error('[getUser] Error:', error);
    return null;
  }
}