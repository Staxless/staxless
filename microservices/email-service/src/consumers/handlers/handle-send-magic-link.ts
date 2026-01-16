// File: /microservices/email-service/src/consumers/handlers/handle-send-magic-link.ts
import type { KafkaMessage } from 'kafkajs';
import createEmailService from '../../config/email-service.js';
import { kafkaClient } from '../../config/kafka-client.js';
import { mailgunClient } from '../../config/mailgun-client.js';

const { sendEmail } = createEmailService(mailgunClient);
const producer = kafkaClient.producer(); // Create producer once at module level

const MAX_RETRIES = 3;
const DLQ_TOPIC = 'email-service-dlq';

interface MessagePayload {
  email: string;
  variables: Record<string, string | number | boolean>; // Fixed type
  retryCount?: number;
  originalTopic?: string;
  errorHistory?: Array<{
    attempt: number;
    error: string;
    timestamp: string;
  }>;
}

export default async function handleSendMagicLink(message: KafkaMessage) {
  if (!message.value) {
    throw new Error('[Email Consumer] Message value is missing');
  }

  const payload: MessagePayload = JSON.parse(message.value.toString());
  const { email, variables, retryCount = 0, errorHistory = [] } = payload;

  try {
    await sendEmail({
      templateKey: 'magic-link',
      email,
      variables,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const currentAttempt = retryCount + 1;

    // Update error history
    const updatedErrorHistory = [
      ...errorHistory,
      {
        attempt: currentAttempt,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
    ];

    // Check if we should retry or send to DLQ
    if (currentAttempt < MAX_RETRIES) {
      await retryMessage({
        email,
        variables,
        retryCount: currentAttempt,
        originalTopic: payload.originalTopic || 'send-magic-link',
        errorHistory: updatedErrorHistory,
      });
    } else {
      await sendToDLQ({
        email,
        variables,
        retryCount: currentAttempt,
        originalTopic: payload.originalTopic || 'send-magic-link',
        errorHistory: updatedErrorHistory,
        finalError: errorMessage,
      });
    }

    throw new Error(
      `[Email Consumer] Failed to send magic link email to ${email} after ${currentAttempt} attempts`
    );
  }
}

async function retryMessage(payload: MessagePayload) {
  try {
    await producer.send({
      // Use the module-level producer
      topic: payload.originalTopic || 'send-magic-link',
      messages: [
        {
          key: payload.email,
          value: JSON.stringify(payload),
          headers: {
            'retry-count': payload.retryCount?.toString() || '0',
          },
        },
      ],
    });
  } catch (error) {
    await sendToDLQ({
      ...payload,
      finalError: 'Failed to queue retry',
    });
    throw new Error(
      `[Email Consumer] Failed to queue retry for ${payload.email}: ${
        (error as Error).message
      }`
    );
  }
}

async function sendToDLQ(payload: MessagePayload & { finalError?: string }) {
  try {
    await producer.send({
      // Use the module-level producer
      topic: DLQ_TOPIC,
      messages: [
        {
          key: payload.email,
          value: JSON.stringify({
            ...payload,
            dlqTimestamp: new Date().toISOString(),
            reason: 'Max retries exceeded',
          }),
          headers: {
            'original-topic': payload.originalTopic || 'send-magic-link',
            'final-error': payload.finalError || 'Unknown error',
          },
        },
      ],
    });
  } catch (error) {
    throw new Error(
      `[Email Consumer] Failed to send message to DLQ for ${payload.email}: ${
        (error as Error).message
      }`
    );
  }
}
