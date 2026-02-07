/**
 * @file consumers/handlers/handle-grant-repo-access.ts
 * @description Handler for granting GitHub repo access when a user completes payment
 */

import type { KafkaMessage } from 'kafkajs';
import { OAuthAccount } from '../../models/oauth-account-model.js';
import {
  getGitHubUserById,
  addRepoCollaborator,
} from '../../services/github-api.js';

interface PaymentEventData {
  id: string; // User ID
  status: string;
  subscriptionId?: string;
  subscriptionType?: string;
  paymentType?: string;
  paymentId?: string;
  endDate?: string;
}

/**
 * Handle payment completion event - grant GitHub repo access
 */
export default async function handleGrantRepoAccess(
  message: KafkaMessage
): Promise<void> {
  const messageValue = message.value?.toString();
  if (!messageValue) {
    console.warn('[GitHub Service] Empty message value, skipping');
    return;
  }

  const data: PaymentEventData = JSON.parse(messageValue);
  const eventKey = message.key?.toString();

  console.log(`[GitHub Service] Processing ${eventKey} for user: ${data.id}`);

  // Only process successful payment/subscription events
  if (data.status !== 'active') {
    console.log(
      `[GitHub Service] Skipping event with status: ${data.status}`
    );
    return;
  }

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
      console.log(
        '[GitHub Service] User may have registered with a different provider'
      );
      return;
    }

    const githubUserId = oauthAccount.provider_user_id;
    console.log(
      `[GitHub Service] Found GitHub user ID: ${githubUserId} for user: ${data.id}`
    );

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
      `[GitHub Service] Resolved GitHub username: ${githubUsername}`
    );

    // 3. Add user as collaborator with triage permission
    const invitation = await addRepoCollaborator(githubUsername);

    if (invitation) {
      console.log(
        `[GitHub Service] Successfully invited ${githubUsername} to Staxless repo`
      );
    } else {
      console.log(
        `[GitHub Service] ${githubUsername} already has access to Staxless repo`
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[GitHub Service] Failed to grant repo access for user ${data.id}: ${errorMessage}`
    );
    throw error;
  }
}
