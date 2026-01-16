// File: /microservices/auth-service/src/consumers/index.ts
// Action: CREATE new file

import { createConsumer } from '../config/kafka-client.js';
import { authEventRegistry } from './handlers/index.js';

const consumer = createConsumer('auth-service-group');

export const startAuthConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'auth-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();
      if (!(eventKey && authEventRegistry.has(eventKey))) {
        throw new Error(
          `[Auth Consumer] No handler registered for event ${eventKey}`
        );
      }

      const handler = authEventRegistry.get(eventKey);
      if (!handler) {
        throw new Error(
          `[Auth Consumer] No handler found for event ${eventKey}`
        );
      }
      try {
        await handler(message);
      } catch (error) {
        throw new Error(
          `[Auth Consumer] Error processing event ${eventKey}, error: ${error}`
        );
      }
    },
  });
};
