// src/consumers/index.ts
import { createConsumer } from '../config/kafka-client.js';
import { sendToDLQ, sendToRetry } from '../lib/kafka-error-handler.js';
import { emailEventRegistry } from './handlers/index.js';

let consumer: ReturnType<typeof createConsumer> | null = null;
let isConnected = false;

export const startEmailConsumer = async (): Promise<void> => {
  if (isConnected) {
    console.log('Kafka consumer already connected');
    return;
  }

  consumer = createConsumer('email-service-group');

  try {
    // Connect with timeout
    const connectPromise = consumer.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Kafka connection timeout')), 10_000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ Kafka consumer connected');

    await consumer.subscribe({ topic: 'email-events', fromBeginning: true });
    console.log('✅ Subscribed to email-events topic');

    await consumer.run({
      autoCommit: false, // Manual commit
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        const eventKey = message.key?.toString();

        if (!(eventKey && emailEventRegistry.has(eventKey))) {
          console.log(`No handler for event: ${eventKey}`);
          await commitOffset(topic, partition, message.offset);
          return;
        }

        const handler = emailEventRegistry.get(eventKey)!;
        const retryCount = Number.parseInt(
          message.headers?.retryCount?.toString() || '0',
          10
        );
        const maxRetries = 3;

        try {
          await handler(message);
          console.log(`✅ Processed event: ${eventKey}`);
          await commitOffset(topic, partition, message.offset);
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.error(`❌ Error processing event ${eventKey}: ${errorMsg}`);

          if (retryCount < maxRetries) {
            await sendToRetry({
              originalMessage: message,
              retryCount: retryCount + 1,
              delaySeconds: 2 ** retryCount * 60, // 60s, 120s, 240s
              error,
            });
          } else {
            await sendToDLQ({ originalMessage: message, error });
          }

          await commitOffset(topic, partition, message.offset);
        }

        await heartbeat();
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

async function commitOffset(topic: string, partition: number, offset: string) {
  if (!consumer) {
    throw new Error('Consumer not initialized');
  }

  await consumer.commitOffsets([
    { topic, partition, offset: (BigInt(offset) + BigInt(1)).toString() },
  ]);
}

export const stopEmailConsumer = async () => {
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

// ❌ REMOVE THIS LINE - don't auto-start
// startEmailConsumer();
