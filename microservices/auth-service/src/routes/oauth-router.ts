/**
 * @file oauth-router.ts
 * @description Express router for handling OAuth authentication flows including:
 *  - Listing configured providers
 *  - Initiating login/registration flows
 *  - Handling provider callbacks to finalize authentication
 *
 * This module integrates with configured OAuth providers and manages session creation
 * using Lucia authentication and secure cookies.
 *
 * @module oauthRouter
 */

import type { Request, Response } from 'express';
import { Router } from 'express';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { auth } from '../config/lucia-config.js';
import { getConfiguredProviders, providers } from '../config/oauth-config.js';
import {
  getUserInfo,
  handleError,
  handleOAuthAction,
  initializeOAuthFlow,
} from '../handlers/oauth-handlers.js';
import type { Provider } from '../lib/providers/provider-types.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// FIXED: Move /providers route BEFORE parameterized routes
router.get('/providers', (_req: Request, res: Response) => {
  try {
    res.json(getConfiguredProviders());
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/login/:providerName', initializeOAuthFlow('login'));
router.get('/register/:providerName', initializeOAuthFlow('register'));

router.get('/:providerName/callback', async (req: Request, res: Response) => {
  const providerName = (req.params.providerName as string)?.toLowerCase();

  if (!providerName) {
    res.redirect(`${FRONTEND_URL}/login?error=Provider name missing`);
    return;
  }

  const provider: Provider = providers[providerName];

  if (!provider) {
    res.redirect(
      `${FRONTEND_URL}/login?error=Invalid provider ${providerName}`
    );
    return;
  }

  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const cookies = parseCookies(req.headers.cookie ?? '');
  const storedState = cookies.get('oauth_state') ?? null;
  const oauthAction = cookies.get('oauth_action') ?? null;

  // Debug logging for OAuth callback
  console.log('OAuth callback received:', {
    providerName,
    hasCode: !!code,
    hasState: !!state,
    stateValue: state,
    hasStoredState: !!storedState,
    storedStateValue: storedState,
    stateMatch: state === storedState,
    hasOAuthAction: !!oauthAction,
    oauthActionValue: oauthAction,
    allCookies: Object.fromEntries(cookies),
    cookieHeader: req.headers.cookie,
    requestHeaders: {
      host: req.headers.host,
      referer: req.headers.referer,
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent'],
    },
  });

  if (!(code && state) || state !== storedState || !oauthAction) {
    console.error('OAuth callback validation failed:', {
      hasCode: !!code,
      hasState: !!state,
      hasStoredState: !!storedState,
      stateMatch: state === storedState,
      hasOAuthAction: !!oauthAction,
      allCookies: Object.fromEntries(cookies),
      cookieHeader: req.headers.cookie,
    });
    res.redirect(`${FRONTEND_URL}/login?error=Invalid state or action`);
    return;
  }

  try {
    const oauthUser = await getUserInfo(provider, code, req);
    const result = await handleOAuthAction(oauthAction, oauthUser, provider);

    // Clear temporary OAuth cookies
    const clearCookies = [
      serializeCookie('oauth_state', '', { maxAge: 0, path: '/' }),
      serializeCookie('oauth_action', '', { maxAge: 0, path: '/' }),
      serializeCookie('code_verifier', '', { maxAge: 0, path: '/' }),
    ];

    const sessionCookie = auth
      .createSessionCookie(result.sessionId)
      .serialize();
    res.setHeader('Set-Cookie', [sessionCookie, ...clearCookies]);

    res.redirect(`${FRONTEND_URL}/${result.redirectUrl}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    handleError(error, res);
  }
});

export default router;
