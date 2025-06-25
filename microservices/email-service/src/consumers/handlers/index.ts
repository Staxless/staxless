// File: /microservices/email-service/src/consumers/handlers/index.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import handleSendMagicLink from './handle-send-magic-link';

export const emailEventRegistry = new Map<string, (message: KafkaMessage) => Promise<void>>([
  ['send.magic-link.email', handleSendMagicLink],
]);