// src/lib/kafka-error-handler.ts
import { KafkaMessage, Producer } from 'kafkajs';
import { createProducer } from '../config/kafka-client.js';

const producer: Producer = createProducer();
await producer.connect();

interface RetryPayload {
  originalMessage: KafkaMessage;
  retryCount: number;
  delaySeconds: number;
  error: any;
}

interface DLQPayload {
  originalMessage: KafkaMessage;
  error: any;
}

export const sendToRetry = async ({
  originalMessage,
  retryCount,
  delaySeconds,
  error,
}: RetryPayload): Promise<void> => {
  const retryTopic = `email-events.retry.${retryCount}`;

  await producer.send({
    topic: retryTopic,
    messages: [
      {
        key: originalMessage.key,
        value: originalMessage.value,
        headers: {
          ...originalMessage.headers,
          retryCount: retryCount.toString(),
          originalTopic: 'email-events',
          error: JSON.stringify(error instanceof Error ? error.message : error),
          retryAfter: (Date.now() + delaySeconds * 1000).toString(),
        },
        timestamp: Date.now().toString(),
      },
    ],
  });

  console.warn(`[Retry] Sent to ${retryTopic} (attempt ${retryCount})`);
};

export const sendToDLQ = async ({ originalMessage, error }: DLQPayload): Promise<void> => {
  await producer.send({
    topic: 'email-events.dlq',
    messages: [
      {
        key: originalMessage.key,
        value: originalMessage.value,
        headers: {
          ...originalMessage.headers,
          error: JSON.stringify(error instanceof Error ? error.message : error),
          failedAt: new Date().toISOString(),
          originalTopic: 'email-events',
        },
      },
    ],
  });

  console.error(`[DLQ] Message sent to email-events.dlq`);
};