import { Endpoint } from 'payload';

interface AuthError extends Error {
  message: string;
  stack?: string;
}

// Type guard to check if an unknown value is an AuthError
function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

export const logoutEndpoint: Endpoint = {
  path: '/auth/logout',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      // Extract cookie header
      const cookieHeader: string = req.headers['cookie'] || req.headers['Cookie'] || '';
      
      if (!cookieHeader) {
        return res.status(200).json({ message: 'No active session found' });
      }

      let sessionID: string | null = null;
      try {
        const cookiePairs: string[] = cookieHeader.split(';');
        for (const pair of cookiePairs) {
          const [name, value] = pair.trim().split('=');
          if (name === 'auth_session' && value) {
            sessionID = value;
            break;
          }
        }
      } catch (error: unknown) {
        const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
        const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
        console.error('[Logout Handler] Cookie parsing error:', errorMessage, errorStack);
        return res.status(200).json({ message: 'No active session found' });
      }

      if (!sessionID) {
        return res.status(200).json({ message: 'No active session found' });
      }

      // Make request to auth service to invalidate session
      try {
        const fetchResponse = await fetch('http://back-gate:8000/auth/logout', {
          method: 'POST',
          headers: {
            Cookie: `auth_session=${sessionID}`,
          },
        });

        if (!fetchResponse.ok) {
          console.error(
            '[Logout Handler] Auth service returned error:',
            fetchResponse.status,
            fetchResponse.statusText
          );
          return res.status(500).json({ error: 'Failed to logout from auth service' });
        }

        // Check if auth service already cleared the cookie
        const authServiceSetCookie = fetchResponse.headers.get('Set-Cookie');
         
        if (!authServiceSetCookie?.includes('auth_session')) {
          // Clear the auth_session cookie locally if not handled by auth service
          res.setHeader('Set-Cookie', 'auth_session=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        }

        return res.status(200).json({ message: 'Successfully logged out' });
      } catch (error: unknown) {
        const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
        const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
        console.error('[Logout Handler] Auth service request failed:', errorMessage, errorStack);
        return res.status(500).json({ error: 'Failed to logout from auth service' });
      }
    } catch (error: unknown) {
      const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
      const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
      console.error('[Logout Handler] Unexpected error:', errorMessage, errorStack);
      return res.status(500).json({ error: 'Internal server error during logout' });
    }
  },
};