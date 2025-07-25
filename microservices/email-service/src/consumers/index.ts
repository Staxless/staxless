// File: /microservices/email-service/src/consumers/index.ts
// Action: CREATE new file

import { createConsumer } from '../config/kafka-client';
import { emailEventRegistry } from './handlers';

const consumer = createConsumer('email-service-group');

export const startEmailConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'email-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();
      if (!(eventKey && emailEventRegistry.has(eventKey))) {
        return;
      }

      const handler = emailEventRegistry.get(eventKey)!;
      try {
        await handler(message);
      } catch (error) {
        throw new Error(
          `[Email Consumer] Error processing event ${eventKey}, error: ${error}`
        );
      }
    },
  });
};
