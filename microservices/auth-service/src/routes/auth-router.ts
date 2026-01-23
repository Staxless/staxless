/**
 * @file auth-router.ts
 * @description Defines authentication-related routes including session validation and logout.
 * Utilizes Lucia for session management and cookie-based authentication.
 *
 * Routes:
 *  - GET /auth/providers: Returns all enabled authentication providers (OAuth + magic link).
 *  - POST /auth/validate-request: Validates and refreshes the user session if valid.
 *  - POST /auth/logout: Logs out the user by invalidating the session.
 *
 * @module authRouter
 */

import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { parseCookies } from 'oslo/cookie';
import { getAllEnabledProviders } from '../config/auth-providers.config.js';
import { auth } from '../config/lucia-config.js';

export const router = Router();

/**
 * GET /auth/providers
 * Returns all enabled authentication methods for the frontend to display.
 * Includes magic link and OAuth providers based on auth-providers.config.ts settings.
 */
router.get('/auth/providers', (_req: Request, res: Response) => {
  try {
    res.json(getAllEnabledProviders());
  } catch (error) {
    console.error('Error fetching enabled providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/auth/validate-request',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId =
        parseCookies(req.headers.cookie ?? '').get('auth_session') ?? null;

      if (!sessionId) {
        res.status(401).send('Unauthorized');
        return;
      }

      const { user, session } = await auth.validateSession(sessionId);

      if (session) {
        const sessionCookie = auth.createSessionCookie(session.id);
        res.cookie(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
        res.status(200).json({ message: 'Session refreshed', user, session });
        return;
      }

      const sessionCookie = auth.createBlankSessionCookie();
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      res.status(401).json({ message: 'Session not found' });
      return;
    } catch (_error) {
      res.status(500).send('Internal Server Error');
      return;
    }
  }
);

router.post(
  '/auth/logout',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId =
        parseCookies(req.headers.cookie ?? '').get('auth_session') ?? null;

      if (!sessionId) {
        res.status(401).send('Unauthorized');
        return;
      }

      await auth.invalidateSession(sessionId);

      res.setHeader('Set-Cookie', auth.createBlankSessionCookie().serialize());
      res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
      return;
    } catch (error) {
      next(error);
    }
  }
);

export default router;
