/**
 * @file consumers/handlers/handle-revoke-repo-access.ts
 * @description Handler for revoking GitHub repo access when a subscription is canceled
 */

import type { KafkaMessage } from 'kafkajs';
import { OAuthAccount } from '../../models/oauth-account-model.js';
import {
  getGitHubUserById,
  removeRepoCollaborator,
} from '../../services/github-api.js';

interface CancellationEventData {
  id: string; // User ID
  status: string;
  subscriptionId?: string;
  subscriptionType?: string;
  canceledAt?: string;
  cancellationType?: string;
}

/**
 * Handle subscription cancellation event - revoke GitHub repo access
 * Note: This only triggers on full cancellation, not pending_cancellation
 */
export default async function handleRevokeRepoAccess(
  message: KafkaMessage
): Promise<void> {
  const messageValue = message.value?.toString();
  if (!messageValue) {
    console.warn('[GitHub Service] Empty message value, skipping');
    return;
  }

  const data: CancellationEventData = JSON.parse(messageValue);

  console.log(
    `[GitHub Service] Processing subscription cancellation for user: ${data.id}`
  );

  try {
    // 1. Look up the user's GitHub OAuth account
    const oauthAccount = await OAuthAccount.findByUserAndProvider(
      data.id,
      'github'
    );

    if (!oauthAccount) {
      console.warn(
        `[GitHub Service] No GitHub OAuth account found for user: ${data.id}`
      );
      return;
    }

    const githubUserId = oauthAccount.provider_user_id;

    // 2. Get the GitHub username from the user ID
    const githubUser = await getGitHubUserById(githubUserId);

    if (!githubUser) {
      console.error(
        `[GitHub Service] Could not find GitHub user with ID: ${githubUserId}`
      );
      return;
    }

    const githubUsername = githubUser.login;
    console.log(
      `[GitHub Service] Revoking access for GitHub user: ${githubUsername}`
    );

    // 3. Remove user from collaborators
    const removed = await removeRepoCollaborator(githubUsername);

    if (removed) {
      console.log(
        `[GitHub Service] Successfully revoked access for ${githubUsername}`
      );
    } else {
      console.log(
        `[GitHub Service] ${githubUsername} was not a collaborator`
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[GitHub Service] Failed to revoke repo access for user ${data.id}: ${errorMessage}`
    );
    throw error;
  }
}
