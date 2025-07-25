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

export const UserAuthStrategy = {
  name: 'auth-service',
  authenticate: async (args: { headers?: any; payload: any }): Promise<{ user: any | null }> => {

    try {
      const { headers = {}, payload } = args;
    
      if (!payload) {
        console.error('[User Strategy] No payload provided');
        return { user: null };
      }

      // Convert HeadersList to plain object
      let headersObj: Record<string, string> = {};
      if (headers && typeof headers.entries === 'function') {
        for (const [key, value] of headers.entries()) {
          headersObj[key] = value;
        }
      } else {
        headersObj = headers as Record<string, string>;
      }
      

      // Access cookie header
      const cookieHeader: string = headersObj['cookie'] || headersObj['Cookie'] || '';
      
      if (!cookieHeader) {

        return { user: null };
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
        console.error('[User Strategy] Cookie parsing error:', errorMessage, errorStack);
        return { user: null };
      }
    

      if (!sessionID) {
        return { user: null };
      }

    
      let response: { session?: any; user?: { id: string; roles: string[]; name?: string } };
      try {
        const fetchResponse = await fetch('http://back-gate:8000/auth/validate-request', {
          method: 'POST',
          headers: {
            Cookie: `auth_session=${sessionID}`,
          },
        });

        if (!fetchResponse.ok) {
          console.error(
            '[User Strategy] Auth service returned error:',
            fetchResponse.status,
            fetchResponse.statusText
          );
          return { user: null };
        }

        response = await fetchResponse.json();
      } catch (error: unknown) {
        const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
        const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
        console.error('[User Strategy] Auth service request failed:', errorMessage, errorStack);
        return { user: null };
      }

      if (!response.session || !response.user) {
       
        return { user: null };
      }

      const { id, roles, name } = response.user;
    

      if (!id || !roles || !Array.isArray(roles)) {
        
        return { user: null };
      }

      // Validate roles against allowed options
      const validRoles = ['admin', 'public'];
      const sanitizedRoles: string[] = roles.filter((role: string) => validRoles.includes(role));
      if (sanitizedRoles.length === 0) {
        return { user: null };
      }

      // Use Payload Local API to find existing user
      let existingUser: {
        id: string;
        first_name?: string;
        last_name?: string;
        email?: string | null;
        roles: string[];
        lastActive?: string;
        createdAt: string;
        updatedAt: string;
        _id: string;
      } | undefined;
      try {
        const findResult = await payload.find({
          collection: 'user',
          where: { id: { equals: id } },
          depth: 0,
        });
    
        existingUser = findResult.docs[0] as typeof existingUser;
        
      } catch (error: unknown) {
        const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
        const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
        console.error('[User Strategy] Find user failed:', errorMessage, errorStack);
        return { user: null };
      }

      if (!existingUser) {
        return { user: null };
      }

      try {
        const updateResult = await payload.update({
          collection: 'user',
          where: { id: { equals: id } },
          id: existingUser._id,
          data: {
            lastActive: new Date().toISOString(),
          },
        });
      } catch (error: unknown) {
        const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
        const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
        console.error('[User Strategy] Update lastActive failed:', errorMessage, errorStack);
        // Continue with authentication even if lastActive update fails
      }

      const userData = {
        id,
        first_name: name || existingUser.first_name || '',
        last_name: existingUser.last_name || '',
        email: existingUser.email || null,
        roles: sanitizedRoles,
        lastActive: new Date().toISOString(),
      };

      return {
        user: {
          ...userData,
          id,
          collection: 'user',
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
        },
      };
    } catch (error: unknown) {
      const errorMessage = isAuthError(error) ? error.message : 'Unknown error';
      const errorStack = isAuthError(error) && error.stack ? error.stack : 'No stack trace';
      console.error('[User Strategy] Unexpected error:', errorMessage, errorStack);
      return { user: null };
    }
  },
};