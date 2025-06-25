
/**
 * Magic Link Handlers
 * 
 * This module provides utility functions for handling magic link authentication flows,
 * including token generation, validation, and user registration/login processes.
 * 
 */

import express, { Request, Response, NextFunction } from "express";
import { auth } from "../config/lucia-config";
import { magicLinkProvider } from "../config/magic-link-config";
import { parseCookies, serializeCookie } from "oslo/cookie";
import crypto from "crypto";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api";

/**
 * Generates a random state token for security.
 * @returns A 32-byte hexadecimal string for state protection.
 */
export const generateStateToken = (): string => {
  const state = crypto.randomBytes(32).toString("hex");
  return state;
};

/**
 * Middleware for state protection, validates state token from cookie and query.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export const stateProtection = (req: Request, res: Response, next: NextFunction): void => {
  const stateCookie = parseCookies(req.headers.cookie ?? "").get("magic_state");
  const stateQuery = req.query.state?.toString();
  
  if (!stateCookie || !stateQuery || stateCookie !== stateQuery) {
    return res.status(403).json({ error: "State token validation failed" });
  }
  next();
};

/**
 * Handles user registration with magic link.
 * @param email - User's email address.
 * @param firstName - User's first name.
 * @param lastName - User's last name.
 * @param res - Express response object.
 * @param state - State token for the magic link.
 * @returns Session ID and redirect URL.
 * @throws Error if user already exists or registration fails.
 */
export async function handleRegistration(
  email: string,
  firstName: string,
  lastName: string,
  res: Response,
  state: string
): Promise<{ sessionId: string; redirectUrl: string }> {
  const existingUser = await auth.adapter.User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered. Please log in.");
  }

  const userId = crypto.randomUUID();
  const newUser = {
    _id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    avatar: "",
    created_at: new Date(),
    subscription: { type: "free", startDate: new Date() },
    roles: ["user"],
  };

  await auth.adapter.User.insertOne(newUser);
  const magicLink = await magicLinkProvider.generateMagicLink(userId, state);
  await magicLinkProvider.sendMagicLink(userId, magicLink);
  return { sessionId: "", redirectUrl: `${FRONTEND_URL}/magic-link-sent` };
}

/**
 * Handles user login with magic link.
 * @param email - User's email address.
 * @param res - Express response object.
 * @param state - State token for the magic link.
 * @returns Session ID and redirect URL.
 * @throws Error if no account is found.
 */
export async function handleLogin(email: string, res: Response, state: string): Promise<{ sessionId: string; redirectUrl: string }> {

  const user = await auth.adapter.User.findOne({ email });
  if (!user) {

    throw new Error("No account found. Please register.");
  }

  const magicLink = await magicLinkProvider.generateMagicLink(user._id, state);

  await magicLinkProvider.sendMagicLink(user._id, magicLink);

  // res.status(200).json({ message: "Magic link sent to your email." });
  return res.status(200).json({ message: "Magic link sent to your email." }).redirect(`${FRONTEND_URL}/magic-link-sent`);
}

/**
 * Processes magic link actions (register or login).
 * @param action - Magic link action ("register" or "login").
 * @param email - User's email address.
 * @param firstName - User's first name (for registration).
 * @param lastName - User's last name (for registration).
 * @param res - Express response object.
 * @param state - State token for the magic link.
 * @returns Session ID and redirect URL.
 * @throws Error if action is invalid.
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
    case "register":
      if (!firstName || !lastName) {
        ('Missing firstName or lastName for registration');
        throw new Error("First name and last name are required for registration");
      }
      return handleRegistration(email, firstName, lastName, res, state);
    case "login":
      return handleLogin(email, res, state);
    default:
       
      throw new Error("Invalid magic link action");
  }
}

/**
 * Handles magic link errors and redirects with appropriate error messages.
 * @param error - Error object from magic link process.
 * @param res - Express response object.
 */
export const handleError = (error: any, res: Response): void => {
  const errorMessage = encodeURIComponent(error.message || "An unexpected error occurred");
  console.error('Magic link error:', error);
  res.redirect(`${FRONTEND_URL}/login?error=${errorMessage}`);
};

/**
 * Initializes magic link flow for login or registration.
 * @param action - Magic link action ("register" or "login").
 * @returns Express middleware function to handle magic link flow initialization.
 */
export const initializeMagicLinkFlow = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
     
     

    if (!["login", "register"].includes(action)) {
       
      res.redirect(`${FRONTEND_URL}/login?error=Invalid action`);
      return;
    }

    try {
      const { email, firstName, lastName } = req.body as {
        email?: string;
        firstName?: string;
        lastName?: string;
      };
      if (!email || typeof email !== "string") {
         
        res.redirect(`${FRONTEND_URL}/login?error=Email is required`);
        return;
      }
      if (action === "register" && (!firstName || !lastName || typeof firstName !== "string" || typeof lastName !== "string")) {
         
        res.redirect(`${FRONTEND_URL}/register?error=First name and last name are required`);
        return;
      }

      const state = generateStateToken();
      const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10 * 1000,
        sameSite: "lax" as const,
      };

      const cookies = [
        serializeCookie("magic_state", state, cookieOptions),
        serializeCookie("magic_action", action, cookieOptions),
      ];

       
      res.setHeader("Set-Cookie", cookies);

       
      const { sessionId, redirectUrl } = await handleMagicLinkAction(action, email, firstName, lastName, res, state);
       
       
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in initializeMagicLinkFlow:', error);
      handleError(error, res);
    }
  };
};

/**
 * Validates and processes a magic link token.
 * @returns Express middleware function to handle magic link validation and login.
 */
export const validateMagicLink = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, state } = req.query;
    const cookies = parseCookies(req.headers.cookie ?? "");
    const storedState = cookies.get("magic_state") ?? null;
    const magicAction = cookies.get("magic_action") ?? null;

     
     

    if (!token || !state || state !== storedState || !magicAction) {
       
      return res.redirect(`${FRONTEND_URL}/login?error=Invalid token or state`);
    }

    try {
      const sessionId = await magicLinkProvider.validateMagicLink(token.toString());
       
      const sessionCookie = auth.createSessionCookie(sessionId).serialize();
      const clearCookies = [
        serializeCookie("magic_state", "", { maxAge: 0, path: "/" }),
        serializeCookie("magic_action", "", { maxAge: 0, path: "/" }),
      ];

       
      res.setHeader("Set-Cookie", [sessionCookie, ...clearCookies]);
       
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('Error in validateMagicLink:', error);
      handleError(error, res);
    }
  };
};
