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

import { randomBytes } from 'node:crypto';
import { createProducer } from './kafka-client.js';
import { auth } from './lucia-config.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';
const TOKEN_EXPIRY_MINUTES = 15;
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false';

// Lazy initialization of Kafka producer
let producer: ReturnType<typeof createProducer> | null = null;
function getProducer() {
  if (!producer && KAFKA_ENABLED) {
    producer = createProducer();
  }
  return producer;
}

// Email validation regex defined at top-level scope for performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // @ts-expect-error
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
    // @ts-expect-error
    const user = await auth.adapter.User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.email) {
      // Basic email validation
      if (!EMAIL_REGEX.test(user.email)) {
        throw new Error('Invalid email format');
      }

      if (!KAFKA_ENABLED) {
        console.warn('Kafka is disabled. Magic link email not sent.');
        console.log(`Magic link for ${user.email}: ${magicLink}`);
        return;
      }

      const kafkaProducer = getProducer();
      if (!kafkaProducer) {
        throw new Error('Kafka producer not available');
      }

      try {
        await kafkaProducer.connect();
        const token = new URL(magicLink).searchParams.get('token') || '';
        await kafkaProducer.send({
          topic: 'email-events',
          messages: [
            {
              key: 'send.magic-link.email',
              value: JSON.stringify({
                email: user.email,
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
            ? (error as { message: string }).message
            : String(error);
        throw new Error(`Failed to send magic link: ${errorMessage}`);
      } finally {
        await kafkaProducer.disconnect();
      }
    }
  }

  /**
   * Validates a magic link token and creates a session.
   * @param token - The magic link token.
   * @returns The session ID.
   * @throws If the token is invalid or expired.
   */
  async validateMagicLink(token: string): Promise<string> {
    // @ts-expect-error
    const magicLink = await auth.adapter.MagicLink.findOne({ token });
    if (!magicLink) {
      throw new Error('Invalid or expired magic link');
    }

    if (new Date() > new Date(magicLink.expires_at)) {
      // @ts-expect-error
      await auth.adapter.MagicLink.deleteOne({ token });
      throw new Error('Magic link expired');
    }

    const session = await auth.createSession(magicLink.user_id, {});
    // @ts-expect-error
    await auth.adapter.MagicLink.deleteOne({ token }); // Delete used token

    return session.id;
  }
}

// Singleton instance of MagicLinkProvider
export const magicLinkProvider = new MagicLinkProvider();
