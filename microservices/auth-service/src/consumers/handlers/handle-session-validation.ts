import type { KafkaMessage } from 'kafkajs';
import { createProducer } from '../../config/kafka-client';
import { auth } from '../../config/lucia-config'; // Adjust path if necessary

const producer = createProducer();

export default async function handleSessionValidation(message: KafkaMessage) {
  await producer.connect();
  if (!message.value) {
    throw new Error('Kafka message value is undefined');
  }
  const { sessionId, correlationId } = JSON.parse(message.value.toString());

  try {
    const { user, session } = await auth.validateSession(sessionId);
    await producer.send({
      topic: 'session-validation-replies',
      messages: [
        {
          key: correlationId,
          value: JSON.stringify({ success: true, user, session }),
        },
      ],
    });
  } catch (error) {
    throw new Error(
      `[Session Validation] Error validating session ${sessionId}, error: ${error}`
    );
    // Send a failure response if session validation fails
  } finally {
    await producer.disconnect();
  }
}
