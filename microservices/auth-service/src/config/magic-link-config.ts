
/**
 * @file magic-link-config.ts
 * @description Defines the MagicLinkProvider class for managing magic link authentication.
 * 
 * @exports
 * - MagicLinkProvider: Class for handling magic link generation, email sending, and validation.
 * - magicLinkProvider: Singleton instance of MagicLinkProvider.
 * 
 * @example
 * import { magicLinkProvider } from './magic-link-config';
 * 
 * // Generate and send a magic link
 * const link = await magicLinkProvider.generateMagicLink(userId, state);
 * await magicLinkProvider.sendMagicLink(userId, link);
 */

import crypto from "crypto";
import axios from "axios";
import { auth } from "./lucia-config";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api"; // Use backend URL for callback
const MAILGUN_SERVICE_URL = process.env.MAILGUN_SERVICE_URL || "http://mailgun-service:8084/send";
const TOKEN_EXPIRY_MINUTES = 15; // Magic link expires in 15 minutes

/**
 * MagicLinkProvider class to handle magic link authentication flows.
 */
export class MagicLinkProvider {
  /**
   * Generates a magic link for a user and stores it in the database.
   * @param userId - The ID of the user.
   * @param state - The state token for CSRF protection.
   * @returns {string} The generated magic link URL.
   */
  async generateMagicLink(userId: string, state: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    auth.adapter.MagicLink.insertOne({
      token,
      user_id: userId,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    const magicLink = `${BACKEND_URL}/auth/magic-link/callback?token=${token}&state=${state}`;
    console.log('Generated magic link:', magicLink);
    return magicLink;
  }

  /**
   * Sends a magic link to the user's email via mailgun-service.
   * @param userId - The ID of the user.
   * @param magicLink - The generated magic link URL.
   */
  async sendMagicLink(userId: string, magicLink: string): Promise<void> {
    const user = await auth.adapter.User.findOne({ _id: userId });
    if (!user || !user.email) {
      throw new Error("User or email not found");
    }

    try {
      await axios.post(MAILGUN_SERVICE_URL, {
        from: "Your App <no-reply@yourdomain.com>",
        to: user.email,
        subject: "Your Magic Link",
        text: `Click this link to log in: ${magicLink}\nThis link expires in ${TOKEN_EXPIRY_MINUTES} minutes.`,
      });
      console.log(`Magic link sent to ${user.email}`);
    } catch (error) {
      console.error("Error sending magic link via mailgun-service:", error);
      throw new Error("Failed to send magic link");
    }
  }

  /**
   * Validates a magic link token and creates a session.
   * @param token - The magic link token.
   * @returns {string} The session ID.
   * @throws {Error} If the token is invalid or expired.
   */
  async validateMagicLink(token: string): Promise<string> {
    const magicLink = await auth.adapter.MagicLink.findOne({token: token });
    if (!magicLink) {
      throw new Error("Invalid or expired magic link");
    }

    if (new Date() > new Date(magicLink.expires_at)) {
      await auth.adapter.MagicLink.deleteOne({ token });
      throw new Error("Magic link expired");
    }

    const session = await auth.createSession(magicLink.user_id, {});
    await auth.adapter.MagicLink.deleteOne({ token }); // Delete used token

    return session.id;
  }
}

// Singleton instance of MagicLinkProvider
export const magicLinkProvider = new MagicLinkProvider();
