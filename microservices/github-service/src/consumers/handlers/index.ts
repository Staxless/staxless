/**
 * @file consumers/handlers/index.ts
 * @description Event handler registry for GitHub service Kafka consumers.
 * Handles payment events to grant/revoke GitHub repo access.
 */

import type { KafkaMessage } from 'kafkajs';
import handleGrantRepoAccess from './handle-grant-repo-access.js';
import handleRevokeRepoAccess from './handle-revoke-repo-access.js';

/**
 * Event handler type definition
 */
type EventHandler = (message: KafkaMessage) => Promise<void>;

/**
 * GitHub service event registry
 * Maps payment event keys to their handlers
 *
 * Events handled:
 * - user.subscription.updated: Grant access on new/renewed subscription
 * - user.payment.completed: Grant access on one-time payment
 * - user.subscription.canceled: Revoke access when subscription fully canceled
 */
export const githubEventRegistry = new Map<string, EventHandler>([
  // Grant access events
  ['user.subscription.updated', handleGrantRepoAccess],
  ['user.payment.completed', handleGrantRepoAccess],

  // Revoke access events
  ['user.subscription.canceled', handleRevokeRepoAccess],
]);
