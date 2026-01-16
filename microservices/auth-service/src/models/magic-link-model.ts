/**
 * OAuth Handlers
 *
 * This module provides utility functions for handling OAuth authentication flows,
 * including CSRF protection, user info normalization, and user registration/login
 * processes for various OAuth providers.
 */
import crypto from 'node:crypto';
import { generateCodeVerifier, OAuth2RequestError } from 'arctic';
import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { auth } from '../config/lucia-config.js';
import { providers } from '../config/oauth-config.js';
import type {
  NormalizedUserInfo,
  Provider,
} from '../lib/providers/provider-types.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Generates a random CSRF token for security.
 * @returns A 32-byte hexadecimal string for CSRF protection.
 */
export const generateCSRFToken = (): string =>
  crypto.randomBytes(32).toString('hex');

/**
 * Middleware for CSRF protection, validates CSRF token from cookie and header.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const csrfCookie = parseCookies(req.headers.cookie ?? '').get('csrf_token');
  const csrfHeader = req.headers['x-csrf-token'];
  if (!(csrfCookie && csrfHeader) || csrfCookie !== csrfHeader) {
    res.status(403).json({ error: 'CSRF token validation failed' });
    return;
  }
  next();
};

/**
 * Fetches user info from the provider, handling optional PKCE.
 * @param provider - OAuth provider configuration.
 * @param code - Authorization code from the provider.
 * @param req - Optional Express request object for PKCE cookie retrieval.
 * @returns Normalized user information.
 * @throws Error if code is missing, provider is misconfigured, or user info fetch fails.
 */
export async function getUserInfo(
  provider: Provider,
  code: string,
  req?: Request
): Promise<NormalizedUserInfo> {
  if (!code) {
    throw new Error('Authorization code missing');
  }
  if (!provider.instance) {
    throw new Error('Provider instance not configured');
  }
  try {
    let codeVerifier: string | undefined;
    if (provider.usePKCE) {
      codeVerifier = parseCookies(req?.headers.cookie ?? '').get(
        'code_verifier'
      );
      if (!codeVerifier) {
        throw new Error('Code verifier missing for PKCE flow');
      }
    }
    const tokens =
      provider.usePKCE && codeVerifier
        ? await provider.instance.validateAuthorizationCode(code, codeVerifier)
        : // @ts-expect-error
          await provider.instance.validateAuthorizationCode(code);
    const userResponse = await axios.get(provider.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    return provider.normalizeUserInfo(userResponse.data); // Use provider's normalizeUserInfo
  } catch (error) {
    throw error instanceof OAuth2RequestError
      ? error
      : new Error('Failed to retrieve user information');
  }
}

/**
 * Creates an OAuth account in the database.
 * @param userId - ID of the user.
 * @param providerUserId - Provider-specific user ID.
 * @param providerId - ID of the OAuth provider.
 */
export async function createOAuthAccount(
  userId: string,
  providerUserId: string,
  providerId: string
): Promise<void> {
  // @ts-expect-error: Adapter typing to be resolved
  await auth.adapter.OauthAccount.insertOne({
    provider_id: providerId,
    provider_user_id: providerUserId,
    user_id: userId,
  });
}

/**
 * Finds an existing OAuth account in the database.
 * @param providerUserId - Provider-specific user ID.
 * @param providerId - ID of the OAuth provider.
 * @returns OAuth account document or null if not found.
 */
export async function findOAuthAccount(
  providerUserId: string,
  providerId: string
): Promise<Record<string, unknown> | null> {
  // @ts-expect-error: Adapter typing to be resolved
  return await auth.adapter.OauthAccount.findOne({
    provider_id: providerId,
    provider_user_id: providerUserId,
  });
}

/**
 * Handles user registration with OAuth.
 * @param oauthUser - Normalized OAuth user data.
 * @param provider - OAuth provider configuration.
 * @returns Session ID and redirect URL.
 * @throws Error if OAuth account already exists.
 */
export async function handleRegistration(
  oauthUser: NormalizedUserInfo,
  provider: Provider
): Promise<{ sessionId: string; redirectUrl: string }> {
  const existingAccount = await findOAuthAccount(oauthUser.id, provider.name);
  if (existingAccount) {
    throw new Error('OAuth account already in use. Please login.');
  }
  const userId = crypto.randomUUID();
  const newUser = {
    _id: userId,
    firstname: oauthUser.fname || '',
    lastname: oauthUser.lname || '',
    email: oauthUser.email || null,
    avatar: oauthUser.picture || '',
    created_at: new Date(),
    subscription: {
      type: 'free',
      startDate: new Date(),
    },
    roles: ['user'],
  };
  // @ts-expect-error: Adapter typing to be resolved
  await auth.adapter.User.insertOne(newUser);
  await createOAuthAccount(userId, oauthUser.id, provider.name);
  const session = await auth.createSession(userId, {});
  return { sessionId: session.id, redirectUrl: 'checkout' };
}

/**
 * Handles user login with OAuth.
 * @param oauthUser - Normalized OAuth user data.
 * @param provider - OAuth provider configuration.
 * @returns Session ID and redirect URL.
 * @throws Error if no account is found.
 */
export async function handleLogin(
  oauthUser: NormalizedUserInfo,
  provider: Provider
): Promise<{ sessionId: string; redirectUrl: string }> {
  const oauthAccount = await findOAuthAccount(oauthUser.id, provider.name);
  if (!oauthAccount) {
    throw new Error('No account found. Please register.');
  }
  const session = await auth.createSession(oauthAccount.user_id as string, {});
  return { sessionId: session.id, redirectUrl: 'dashboard' };
}

/**
 * Processes OAuth actions (register or login).
 * @param action - OAuth action ("register" or "login").
 * @param oauthUser - Normalized OAuth user data.
 * @param provider - OAuth provider configuration.
 * @returns Session ID and redirect URL.
 * @throws Error if action is invalid.
 */
export function handleOAuthAction(
  action: string | null,
  oauthUser: NormalizedUserInfo,
  provider: Provider
): Promise<{ sessionId: string; redirectUrl: string }> {
  switch (action) {
    case 'register':
      return handleRegistration(oauthUser, provider);
    case 'login':
      return handleLogin(oauthUser, provider);
    default:
      throw new Error('Invalid OAuth action');
  }
}

/**
 * Handles OAuth errors and redirects with appropriate error messages.
 * @param error - Error object from OAuth process.
 * @param res - Express response object.
 */
export const handleError = (error: unknown, res: Response): void => {
  let errorMessage = 'An unexpected error occurred';
  if (
    error instanceof OAuth2RequestError &&
    error.message === 'bad_verification_code'
  ) {
    errorMessage = 'Bad verification code';
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    errorMessage = encodeURIComponent((error as { message: string }).message);
  }
  res.redirect(`${FRONTEND_URL}/login?error=${errorMessage}`);
};

/**
 * Initializes OAuth flow for login or registration.
 * @param action - OAuth action ("register" or "login").
 * @returns Express middleware function to handle OAuth flow initialization.
 */
export const initializeOAuthFlow = (action: string) => {
  return async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const providerName = req.params.providerName.toLowerCase();
    const provider: Provider = providers[providerName];
    if (!['login', 'register'].includes(action)) {
      res.redirect(`${FRONTEND_URL}/login?error=Invalid action`);
      return;
    }
    if (!provider?.instance) {
      res.redirect(
        `${FRONTEND_URL}/login?error=Invalid provider ${providerName}`
      );
      return;
    }
    try {
      const state = crypto.randomBytes(16).toString('hex');
      const csrfToken = generateCSRFToken();
      const codeVerifier = provider.usePKCE
        ? generateCodeVerifier()
        : undefined;
      const cookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10 * 1000,
        sameSite: 'lax' as const,
      };
      const cookies = [
        serializeCookie('oauth_state', state, cookieOptions),
        serializeCookie('oauth_action', action, cookieOptions),
        serializeCookie('csrf_token', csrfToken, {
          ...cookieOptions,
          httpOnly: false,
        }),
      ];
      if (provider.usePKCE && codeVerifier) {
        cookies.push(
          serializeCookie('code_verifier', codeVerifier, cookieOptions)
        );
      }
      const authUrl = await (provider.usePKCE && codeVerifier
        ? provider.instance.createAuthorizationURL(state, codeVerifier, {
            scopes: provider.scopes as string[], // Type assertion to ensure compatibility
          })
        : // @ts-expect-error
          provider.instance.createAuthorizationURL(state, {
            scopes: provider.scopes, // Type assertion to ensure compatibility
          }));
      res.setHeader('Set-Cookie', cookies);
      res.redirect(authUrl.toString());
    } catch (error) {
      handleError(error, res);
    }
  };
};
