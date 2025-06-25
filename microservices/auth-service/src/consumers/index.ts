// File: /microservices/auth-service/src/consumers/index.ts
// Action: CREATE new file

import { createConsumer } from '../config/kafka-client';
import { authEventRegistry } from './handlers';

const consumer = createConsumer('auth-service-group');

export const startAuthConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'auth-events', fromBeginning: true });
  console.log('Auth consumer started, listening for events...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();
      if (!eventKey || !authEventRegistry.has(eventKey)) {
        console.warn(`[Auth Consumer] No handler found for event: ${eventKey}`);
        return;
      }
      
      const handler = authEventRegistry.get(eventKey)!;
      try {
        await handler(message);
      } catch (error) {
        console.error(`[Auth Consumer] Error processing event ${eventKey}`, error);
      }
    },
  });
};