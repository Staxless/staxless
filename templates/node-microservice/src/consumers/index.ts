/**
 * @file consumers/index.ts
 * @description Kafka consumer initialization for template-service
 */

import { createConsumer } from '../config/kafka-client.js';
import { templateEventRegistry } from './handlers/index.js';

const consumer = createConsumer('template-service-group');

export const startTemplateConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'template-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();

      if (!eventKey) {
        console.warn('[template-service] Received message without event key');
        return;
      }

      if (!templateEventRegistry.has(eventKey)) {
        console.warn(`[template-service] No handler registered for event: ${eventKey}`);
        return;
      }

      const handler = templateEventRegistry.get(eventKey);
      if (!handler) {
        console.error(`[template-service] Handler not found for event: ${eventKey}`);
        return;
      }

      try {
        await handler(message);
        console.log(`[template-service] Successfully processed event: ${eventKey}`);
      } catch (error) {
        console.error(
          `[template-service] Error processing event ${eventKey}:`,
          error instanceof Error ? error.message : error
        );
        throw error;
      }
    },
  });
};
