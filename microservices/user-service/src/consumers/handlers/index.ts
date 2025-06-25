// File: /microservices/user-service/src/consumers/handlers/index.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import handleSubscriptionUpdate from './handle-subscription-update';

export const paymentEventRegistry = new Map<string, (message: KafkaMessage) => Promise<void>>([
  ['user.subscription.updated', handleSubscriptionUpdate],
]);