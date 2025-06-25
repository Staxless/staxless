// File: /microservices/user-service/src/consumers/index.ts
// Action: CREATE new file

import { createConsumer } from '../config/kafka-client';
import { paymentEventRegistry } from './handlers';

const consumer = createConsumer('user-service-group');

export const startUserConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment-events', fromBeginning: true });
  console.log('User consumer started...');
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventKey = message.key?.toString();
      if (!eventKey || !paymentEventRegistry.has(eventKey)) return;

      const handler = paymentEventRegistry.get(eventKey)!;
      try {
        await handler(message);
      } catch (error) {
        console.error(`[User Consumer] Error processing payment event ${eventKey}`, error);
      }
    },
  });
};