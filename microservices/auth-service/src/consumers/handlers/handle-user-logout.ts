// File: /microservices/auth-service/src/consumers/handlers/handle-user-logout.ts
// Action: CREATE new file

import type { KafkaMessage } from 'kafkajs';
import { auth } from '../../config/lucia-config.js'; // Adjust path if necessary

export default async function handleUserLogout(message: KafkaMessage) {
  if (!message.value) {
    throw new Error('Kafka message value is undefined');
  }
  const { sessionId } = JSON.parse(message.value.toString());
  if (sessionId) {
    await auth.invalidateSession(sessionId);
  }
}
