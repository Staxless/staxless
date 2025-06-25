// File: /microservices/email-service/src/consumers/index.ts
// Action: CREATE new file

import { createConsumer } from '../config/kafka-client';
import { emailEventRegistry } from './handlers';

const consumer = createConsumer('email-service-group');

export const startEmailConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'email-events', fromBeginning: true });
  console.log('Email consumer started...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();
      if (!eventKey || !emailEventRegistry.has(eventKey)) {
        console.warn(`[Email Consumer] No handler for event: ${eventKey}`);
        return;
      }

      const handler = emailEventRegistry.get(eventKey)!;
      try {
        await handler(message);
      } catch (error) {
        console.error(`[Email Consumer] Error processing event ${eventKey}`, error);
      }
    },
  });
};