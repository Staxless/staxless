/**
 * @file consumers/index.ts
 * @description Kafka consumer initialization for github-service
 * Listens to payment-events to manage GitHub repo access
 */

import { createConsumer } from '../config/kafka-client.js';
import { githubEventRegistry } from './handlers/index.js';

const consumer = createConsumer('github-service-group');

export const startGithubConsumer = async () => {
  await consumer.connect();

  // Subscribe to payment-events to react to successful payments/cancellations
  await consumer.subscribe({ topic: 'payment-events', fromBeginning: false });

  console.log('[GitHub Service] Subscribed to payment-events topic');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();

      if (!eventKey) {
        console.warn('[GitHub Service] Received message without event key');
        return;
      }

      // Only process events we have handlers for
      if (!githubEventRegistry.has(eventKey)) {
        // This is expected - we don't handle all payment events
        console.debug(
          `[GitHub Service] Ignoring unhandled event: ${eventKey}`
        );
        return;
      }

      const handler = githubEventRegistry.get(eventKey);
      if (!handler) {
        console.error(
          `[GitHub Service] Handler not found for event: ${eventKey}`
        );
        return;
      }

      try {
        await handler(message);
        console.log(
          `[GitHub Service] Successfully processed event: ${eventKey}`
        );
      } catch (error) {
        console.error(
          `[GitHub Service] Error processing event ${eventKey}:`,
          error instanceof Error ? error.message : error
        );
        // Don't rethrow - we don't want to crash the consumer
        // The error is logged and we continue processing
      }
    },
  });
};
