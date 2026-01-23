/**
 * Magic Link Handlers
 *
 * This module provides utility functions for handling magic link authentication flows,
 * including token generation, handling, and user registration/login processes.
 */

import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { createProducer } from '../config/kafka-client.js';
import { auth } from '../config/lucia-config.js';
import { magicLinkProvider } from '../config/magic-link-config.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const TOKEN_EXPIRY_MINUTES = 15;
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false';

// Lazy initialization of Kafka producer
let producer: ReturnType<typeof createProducer> | null = null;
function getProducer() {
  if (!producer && KAFKA_ENABLED) {
    producer = createProducer();
    // Connect producer and setup cleanup
    producer.connect().catch(err => console.error('Kafka producer connection error:', err));
    process.on('SIGTERM', async () => {
      if (producer) {
        await producer.disconnect();
      }
      process.exit(0);
    });
  }
  return producer;
}

/**
 * Generates a random state token for security.
 * @returns A 32-byte hexadecimal string for state protection.
 */
export const generateStateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Middleware for state protection, validates state token from cookie and query.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const stateProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): undefined | Response => {
  const stateCookie = parseCookies(req.headers.cookie ?? '').get('magic_state');
  const stateQuery = req.query.state?.toString();

  if (!(stateCookie && stateQuery) || stateCookie !== stateQuery) {
    return res.status(403).json({ error: 'State token validation failed' });
  }
  next();
};

/**
 * Handles user registration with magic link.
 * @param email - User's email address
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param res - Express response object
 * @param state - State token for the magic link
 * @returns Session ID and redirect URL
 * @throws Error if user already exists or registration fails
 */
export async function handleRegistration(
  email: string,
  firstName: string,
  lastName: string,
  _res: Response,
  state: string
): Promise<{ sessionId: string; redirectUrl: string }> {
  // @ts-expect-error
  const existingUser = await auth.adapter.User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered. Please log in.');
  }

  const userId = crypto.randomUUID();
  const newUser = {
    _id: userId,
    email,
    firstname: firstName,
    lastname: lastName,
    avatar: '',
    created_at: new Date(),
    subscription: { type: 'free', startDate: new Date() },
    roles: ['user'],
  };
  // @ts-expect-error
  await auth.adapter.User.insertOne(newUser);
  const magicLink = await magicLinkProvider.generateMagicLink(userId, state);

  if (KAFKA_ENABLED) {
    const kafkaProducer = getProducer();
    if (kafkaProducer) {
      try {
        const token = new URL(magicLink).searchParams.get('token') || '';
        await kafkaProducer.send({
          topic: 'email-events',
          messages: [
            {
              key: 'send.magic-link.email',
              value: JSON.stringify({
                email,
                variables: {
                  token,
                  link: magicLink,
                  expiryMinutes: TOKEN_EXPIRY_MINUTES,
                },
              }),
            },
          ],
        });
      } catch (error) {
        const errorMessage =
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : String(error);
        throw new Error(`Failed to send magic link: ${errorMessage}`);
      }
    }
  } else {
    console.log(`[DEV] Magic link: ${magicLink}`);
  }

  return { sessionId: '', redirectUrl: `${FRONTEND_URL}/magic-link-sent` };
}

/**
 * Handles user login with magic link.
 * @param email - User's email address
 * @param res - Express response object
 * @param state - State token for the magic link
 * @returns Session ID and redirect URL
 * @throws Error if no account is found
 */
export async function handleLogin(
  email: string,
  _res: Response,
  state: string
): Promise<{ sessionId: string; redirectUrl: string }> {
  // @ts-expect-error
  const user = await auth.adapter.User.findOne({ email });
  if (!user) {
    throw new Error('No account found. Please register.');
  }

  const magicLink = await magicLinkProvider.generateMagicLink(user._id, state);

  if (KAFKA_ENABLED) {
    const kafkaProducer = getProducer();
    if (kafkaProducer) {
      try {
        const token = new URL(magicLink).searchParams.get('token') || '';
        await kafkaProducer.send({
          topic: 'email-events',
          messages: [
            {
              key: 'send.magic-link.email',
              value: JSON.stringify({
                email,
                variables: {
                  token,
                  link: magicLink,
                  expiryMinutes: TOKEN_EXPIRY_MINUTES,
                },
              }),
            },
          ],
        });
      } catch (error) {
        const errorMessage =
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : String(error);
        throw new Error(`Failed to send magic link: ${errorMessage}`);
      }
    }
  } else {
    console.log(`[DEV] Magic link: ${magicLink}`);
  }

  return { sessionId: '', redirectUrl: `${FRONTEND_URL}/magic-link-sent` };
}

/**
 * Processes magic link actions (register or login).
 * @param action - Magic link action ("register" or "login")
 * @param email - User's email address
 * @param firstName - User's first name (for registration)
 * @param lastName - User's last name (for registration)
 * @param res - Express response object
 * @param state - State token for the magic link
 * @returns Session ID and redirect URL
 * @throws Error if action is invalid
 */
export async function handleMagicLinkAction(
  action: string | null,
  email: string,
  firstName: string | undefined,
  lastName: string | undefined,
  res: Response,
  state: string
): Promise<{ sessionId: string; redirectUrl: string }> {
  switch (action) {
    case 'register':
      if (!(firstName && lastName)) {
        throw new Error(
          'First name and last name are required for registration'
        );
      }
      return await handleRegistration(email, firstName, lastName, res, state);
    case 'login':
      return await handleLogin(email, res, state);
    default:
      throw new Error('Invalid magic link action');
  }
}

/**
 * Handles magic link errors and redirects with appropriate error messages.
 * @param error - Error object from magic link process
 * @param res - Express response object
 */
export const handleError = (error: Error, res: Response): void => {
  const errorMessage = encodeURIComponent(
    error.message || 'An unexpected error occurred'
  );
  res.redirect(`${FRONTEND_URL}/login?error=${errorMessage}`);
};

/**
 * Checks if the request expects a JSON response (API call vs form submission)
 * @param req - Express request object
 * @returns true if the client expects JSON
 */
function expectsJson(req: Request): boolean {
  const accept = req.headers.accept || '';
  const contentType = req.headers['content-type'] || '';
  return accept.includes('application/json') || contentType.includes('application/json');
}

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 2;

/**
 * Validates and sanitizes email input
 * @param email - Email to validate
 * @returns Object with isValid flag and sanitized email or error message
 */
function validateEmail(email: unknown): { isValid: boolean; value?: string; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const sanitized = email.trim().toLowerCase();

  if (sanitized.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (sanitized.length > MAX_EMAIL_LENGTH) {
    return { isValid: false, error: 'Email address is too long' };
  }

  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, value: sanitized };
}

/**
 * Validates and sanitizes name input
 * @param name - Name to validate
 * @param fieldName - Field name for error messages
 * @returns Object with isValid flag and sanitized name or error message
 */
function validateName(name: unknown, fieldName: string): { isValid: boolean; value?: string; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const sanitized = name.trim();

  if (sanitized.length < MIN_NAME_LENGTH) {
    return { isValid: false, error: `${fieldName} must be at least ${MIN_NAME_LENGTH} characters` };
  }

  if (sanitized.length > MAX_NAME_LENGTH) {
    return { isValid: false, error: `${fieldName} must be less than ${MAX_NAME_LENGTH} characters` };
  }

  if (!NAME_REGEX.test(sanitized)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true, value: sanitized };
}

/**
 * Initializes magic link flow for login or registration.
 * @param action - Magic link action ("register" or "login")
 * @returns Express middleware function to handle magic link flow initialization
 */
export const initializeMagicLinkFlow = (action: string) => {
  return async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const isApiRequest = expectsJson(req);

    const sendError = (error: string, redirectPath = '/login') => {
      if (isApiRequest) {
        res.status(400).json({ error });
      } else {
        res.redirect(`${FRONTEND_URL}${redirectPath}?error=${encodeURIComponent(error)}`);
      }
    };

    if (!['login', 'register'].includes(action)) {
      sendError('Invalid action');
      return;
    }

    try {
      const { email: rawEmail, firstName: rawFirstName, lastName: rawLastName } = req.body as {
        email?: unknown;
        firstName?: unknown;
        lastName?: unknown;
      };

      // Validate email
      const emailValidation = validateEmail(rawEmail);
      if (!emailValidation.isValid) {
        sendError(emailValidation.error!);
        return;
      }
      const email = emailValidation.value!;

      // Validate names for registration
      let firstName: string | undefined;
      let lastName: string | undefined;

      if (action === 'register') {
        const firstNameValidation = validateName(rawFirstName, 'First name');
        if (!firstNameValidation.isValid) {
          sendError(firstNameValidation.error!, '/register');
          return;
        }
        firstName = firstNameValidation.value;

        const lastNameValidation = validateName(rawLastName, 'Last name');
        if (!lastNameValidation.isValid) {
          sendError(lastNameValidation.error!, '/register');
          return;
        }
        lastName = lastNameValidation.value;
      }

      const state = generateStateToken();
      const cookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10 * 1000,
        sameSite: 'lax' as const,
      };

      const cookies = [
        serializeCookie('magic_state', state, cookieOptions),
        serializeCookie('magic_action', action, cookieOptions),
      ];

      res.setHeader('Set-Cookie', cookies);

      const { redirectUrl } = await handleMagicLinkAction(
        action,
        email,
        firstName,
        lastName,
        res,
        state
      );

      if (isApiRequest) {
        res.json({ success: true, redirectUrl, message: 'Magic link sent successfully' });
      } else {
        res.redirect(redirectUrl);
      }
    } catch (error) {
      if (isApiRequest) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(400).json({ error: errorMessage });
      } else {
        handleError(error as Error, res);
      }
    }
  };
};

/**
 * Validates and processes a magic link token.
 * @returns Express middleware function to handle magic link validation and login
 */
export const validateMagicLink = () => {
  return async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
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
  };
};
