/**
 * @file models/oauth-account-model.ts
 * @description Read-only access to OAuth accounts for looking up GitHub user IDs
 */

import type { Collection, Db, WithId } from 'mongodb';
import { database } from '../config/db-config.js';

export interface OAuthAccountType {
  provider_id: string;
  provider_user_id: string;
  user_id: string;
}

let cachedCollection: Collection<OAuthAccountType> | null = null;

/**
 * Get the OAuth accounts collection
 */
async function getCollection(): Promise<Collection<OAuthAccountType>> {
  if (cachedCollection) {
    return cachedCollection;
  }

  const db: Db = await database.getClient();
  cachedCollection = db.collection('oauthAccount') as Collection<OAuthAccountType>;
  return cachedCollection;
}

export const OAuthAccount = {
  /**
   * Find an OAuth account by user ID and provider
   * @param userId - The internal user ID
   * @param providerId - The OAuth provider (e.g., 'github')
   * @returns The OAuth account or null
   */
  async findByUserAndProvider(
    userId: string,
    providerId: string
  ): Promise<WithId<OAuthAccountType> | null> {
    const collection = await getCollection();
    return collection.findOne({
      user_id: userId,
      provider_id: providerId,
    });
  },

  /**
   * Find all OAuth accounts for a user
   * @param userId - The internal user ID
   * @returns Array of OAuth accounts
   */
  async findByUserId(userId: string): Promise<WithId<OAuthAccountType>[]> {
    const collection = await getCollection();
    return collection.find({ user_id: userId }).toArray();
  },
};
