/**
 * @file logout-endpoint.ts
 * @description Endpoint for handling user logout
 */

import type { NextFunction, Request, Response } from 'express';
import type { Endpoint } from 'payload';

interface AuthError extends Error {
  message: string;
  stack?: string;
}

// Type guard to check if an unknown value is an AuthError
function _isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

/**
 * Extracts session ID from cookie header
 * @param headers - Request headers
 * @returns Session ID or null if not found
 */
function extractSessionId(headers: Request['headers']): string | null {
  const cookieHeader: string = headers.cookie || headers.Cookie || '';
  if (!cookieHeader) {
    return null;
  }

  try {
    const cookiePairs: string[] = cookieHeader.split(';');
    for (const pair of cookiePairs) {
      const [name, value] = pair.trim().split('=');
      if (name === 'auth_session' && value) {
        return value;
      }
    }
  } catch (_error: unknown) {
    return null;
  }
  return null;
}

/**
 * Invalidates session by calling auth service
 * @param sessionID - Session ID to invalidate
 * @returns True if logout successful, false otherwise
 */
async function invalidateSession(sessionID: string): Promise<boolean> {
  try {
    const fetchResponse = await fetch('http://back-gate:8000/auth/logout', {
      method: 'POST',
      headers: {
        Cookie: `auth_session=${sessionID}`,
      },
    });
    return fetchResponse.ok;
  } catch (_error: unknown) {
    return false;
  }
}

/**
 * Clears auth_session cookie in response
 * @param res - Express Response object
 */
function clearAuthCookie(res: Response): void {
  res.setHeader(
    'Set-Cookie',
    'auth_session=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
}

export const logoutEndpoint: Endpoint = {
  path: '/auth/logout',
  method: 'post',
  handler: async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const sessionID = extractSessionId(req.headers);
      if (!sessionID) {
        return res.status(200).json({ message: 'No active session found' });
      }

      const logoutSuccessful = await invalidateSession(sessionID);
      if (!logoutSuccessful) {
        return res
          .status(500)
          .json({ error: 'Failed to logout from auth service' });
      }

      // Check if auth service already cleared the cookie
      const authServiceSetCookie = (
        await fetch('http://back-gate:8000/auth/logout', {
          method: 'POST',
          headers: {
            Cookie: `auth_session=${sessionID}`,
          },
        })
      ).headers.get('Set-Cookie');

      if (!authServiceSetCookie?.includes('auth_session')) {
        clearAuthCookie(res);
      }

      return res.status(200).json({ message: 'Successfully logged out' });
    } catch (_error: unknown) {
      return res
        .status(500)
        .json({ error: 'Internal server error during logout' });
    }
  },
};
