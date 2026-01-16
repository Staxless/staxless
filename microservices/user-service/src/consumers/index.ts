// File: /microservices/user-service/src/consumers/index.ts

import { createConsumer } from '../config/kafka-client.js';
import { paymentEventRegistry } from './handlers/index.js';

let consumer: ReturnType<typeof createConsumer> | null = null;
let isConnected = false;

export const startUserConsumer = async () => {
  if (isConnected) {
    console.log('Kafka consumer already connected');
    return;
  }

  consumer = createConsumer('user-service-group');

  try {
    // Connect with timeout
    const connectPromise = consumer.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Kafka connection timeout')), 10_000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ Kafka consumer connected');

    await consumer.subscribe({ topic: 'payment-events', fromBeginning: true });
    console.log('✅ Subscribed to payment-events topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventKey = message.key?.toString();

        if (!(eventKey && paymentEventRegistry.has(eventKey))) {
          console.log(`No handler for event: ${eventKey}`);
          return;
        }

        const handler = paymentEventRegistry.get(eventKey);
        if (!handler) {
          return;
        }

        try {
          await handler(message);
          console.log(`✅ Processed event: ${eventKey}`);
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.error(`❌ Error processing event ${eventKey}: ${errorMsg}`);

          // Check if it's a database connection error
          if (
            errorMsg.includes('not a function') ||
            errorMsg.includes('not connected')
          ) {
            console.error(
              '⚠️  Database connection issue detected. Ensure database is connected before Kafka consumer starts.'
            );
          }

          // Don't re-wrap the error - just log it
          // Don't throw - let consumer continue processing other messages
        }
      },
    });

    isConnected = true;
    console.log('✅ Kafka consumer running');
  } catch (error) {
    isConnected = false;
    console.error('❌ Failed to start Kafka consumer:', error);

    // Attempt to disconnect if partially connected
    if (consumer) {
      try {
        await consumer.disconnect();
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
    }

    throw error;
  }
};

export const stopUserConsumer = async () => {
  if (consumer && isConnected) {
    try {
      await consumer.disconnect();
      isConnected = false;
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting Kafka consumer:', error);
    }
  }
};

export const getConsumerStatus = () => ({
  isConnected,
  hasConsumer: consumer !== null,
});

export default consumer;
