// File: /microservices/auth-service/src/consumers/handlers/handle-user-logout.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import { auth } from '../../config/lucia-config'; // Adjust path if necessary

export default async function handleUserLogout(message: KafkaMessage) {
  const { sessionId } = JSON.parse(message.value!.toString());
  if (sessionId) {
    await auth.invalidateSession(sessionId);
    console.log(`[Auth Consumer] Session invalidated: ${sessionId}`);
  }
}