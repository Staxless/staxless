// File: /microservices/auth-service/src/consumers/handlers/index.ts
// Action: CREATE new file

import type { KafkaMessage } from 'kafkajs';
import handleSessionValidation from './handle-session-validation.js';
import handleUserLogout from './handle-user-logout.js';

export const authEventRegistry = new Map<
  string,
  (message: KafkaMessage) => Promise<void>
>([
  ['user.session.validation.requested', handleSessionValidation],
  ['user.logout.initiated', handleUserLogout],
]);
