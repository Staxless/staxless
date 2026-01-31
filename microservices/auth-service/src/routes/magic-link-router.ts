/**
 * @file magic-link-router.ts
 * @description Express router for handling magic link authentication flows including:
 *  - Initiating login/registration flows
 *  - Handling magic link callbacks to finalize authentication
 *
 * This module integrates with the magic link configuration and manages session creation
 * using Lucia authentication and secure cookies.
 *
 * @module magicLinkRouter
 */

import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { auth } from '../config/lucia-config.js';
import { isMagicLinkEnabled } from '../config/auth-providers.config.js';
import { magicLinkProvider } from '../config/magic-link-config.js';
import {
  handleError,
  initializeMagicLinkFlow,
} from '../handlers/magic-link-handlers.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Check if magic link authentication is configured/enabled
router.get('/magic-link/configured', (_req: Request, res: Response) => {
  try {
    res.json({ enabled: isMagicLinkEnabled() });
  } catch (error) {
    console.error('Error checking magic link configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/magic-link/login', initializeMagicLinkFlow('login'));

router.post('/magic-link/register', initializeMagicLinkFlow('register'));

router.get(
  '/magic-link/callback',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { token, state } = req.query;
    const cookies = parseCookies(req.headers.cookie ?? '');
    const storedState = cookies.get('magic_state') ?? null;
    const magicAction = cookies.get('magic_action') ?? null;

    if (!(token && state) || state !== storedState || !magicAction) {
      return res.redirect(`${FRONTEND_URL}/login?error=Invalid token or state`);
    }

    try {
      const sessionId = await magicLinkProvider.validateMagicLink(
        token.toString()
      );

      const sessionCookie = auth.createSessionCookie(sessionId).serialize();
      const clearCookies = [
        serializeCookie('magic_state', '', { maxAge: 0, path: '/' }),
        serializeCookie('magic_action', '', { maxAge: 0, path: '/' }),
      ];

      res.setHeader('Set-Cookie', [sessionCookie, ...clearCookies]);

      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (error) {
      handleError(error as Error, res);
    }
  }
);

export default router;
