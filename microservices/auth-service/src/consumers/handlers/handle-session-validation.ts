// File: /microservices/auth-service/src/consumers/handlers/handle-session-validation.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import { auth } from '../../config/lucia-config'; // Adjust path if necessary
import { createProducer } from '../../config/kafka-client';

const producer = createProducer();

export default async function handleSessionValidation(message: KafkaMessage) {
  await producer.connect();
  const { sessionId, correlationId } = JSON.parse(message.value!.toString());
  
  try {
    const { user, session } = await auth.validateSession(sessionId);
    await producer.send({
      topic: 'session-validation-replies',
      messages: [{ key: correlationId, value: JSON.stringify({ success: true, user, session }) }]
    });
  } catch (e) {
    await producer.send({
      topic: 'session-validation-replies',
      messages: [{ key: correlationId, value: JSON.stringify({ success: false, error: 'Invalid session' }) }]
    });
  }
}