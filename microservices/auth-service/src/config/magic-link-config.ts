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

import crypto from 'crypto';
import { auth } from './lucia-config';
import { createProducer } from './kafka-client';

const producer = createProducer();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';
const TOKEN_EXPIRY_MINUTES = 15;

// Define types for Lucia adapter (assuming MongoDB or similar)
interface User {
  _id: string;
  email: string;
}

interface MagicLink {
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
}

interface AuthAdapter {
  User: {
    findOne: (query: { _id: string }) => Promise<User | null>;
  };
  MagicLink: {
    insertOne: (data: MagicLink) => Promise<void>;
    findOne: (query: { token: string }) => Promise<MagicLink | null>;
    deleteOne: (query: { token: string }) => Promise<void>;
  };
}

interface Auth {
  adapter: AuthAdapter;
  createSession: (userId: string, attributes: Record<string, any>) => Promise<{ id: string }>;
}

/**
 * MagicLinkProvider class to handle magic link authentication flows.
 */
export class MagicLinkProvider {
  /**
   * Generates a magic link for a user and stores it in the database.
   * @param userId - The ID of the user.
   * @param state - The state token for CSRF protection.
   * @returns The generated magic link URL.
   */
  async generateMagicLink(userId: string, state: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await auth.adapter.MagicLink.insertOne({
      token,
      user_id: userId,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    const magicLink = `${BACKEND_URL}/auth/magic-link/callback?token=${token}&state=${state}`;
    return magicLink;
  }

  /**
   * Sends a magic link to the user's email via Kafka event.
   * @param userId - The ID of the user.
   * @param magicLink - The generated magic link URL.
   */
  async sendMagicLink(userId: string, magicLink: string): Promise<void> {
    const user = await auth.adapter.User.findOne({ _id: userId });
    if (!user || !user.email) {
      throw new Error('User or email not found');
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error('Invalid email format');
    }

    try {
      await producer.connect();
      const token = new URL(magicLink).searchParams.get('token') || '';
      await producer.send({
        topic: 'email-events',
        messages: [{
          key: 'send.magic-link.email',
          value: JSON.stringify({
            email: user.email,
            variables: {
              token,
              link: magicLink,
              expiryMinutes: TOKEN_EXPIRY_MINUTES,
            },
          }),
        }],
      });
      console.log(`Produced magic link event for ${user.email}`);
    } catch (error: any) {
      console.error('Error producing magic link event:', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to send magic link: ${error.message}`);
    } finally {
      await producer.disconnect();
    }
  }

  /**
   * Validates a magic link token and creates a session.
   * @param token - The magic link token.
   * @returns The session ID.
   * @throws If the token is invalid or expired.
   */
  async validateMagicLink(token: string): Promise<string> {
    const magicLink = await auth.adapter.MagicLink.findOne({ token });
    if (!magicLink) {
      throw new Error('Invalid or expired magic link');
    }

    if (new Date() > new Date(magicLink.expires_at)) {
      await auth.adapter.MagicLink.deleteOne({ token });
      throw new Error('Magic link expired');
    }

    const session = await auth.createSession(magicLink.user_id, {});
    await auth.adapter.MagicLink.deleteOne({ token }); // Delete used token

    return session.id;
  }
}

// Singleton instance of MagicLinkProvider
export const magicLinkProvider = new MagicLinkProvider();