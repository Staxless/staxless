/**
 * @file consumers/handlers/index.ts
 * @description Event handler registry for Kafka consumers.
 * Register your event handlers here.
 */

import type { KafkaMessage } from 'kafkajs';

/**
 * Event handler type definition
 */
type EventHandler = (message: KafkaMessage) => Promise<void>;

/**
 * Example event handler
 * Replace or extend with your own handlers
 */
const handleExampleEvent: EventHandler = async (message: KafkaMessage) => {
  const value = message.value?.toString();
  console.log('[Handler] Processing example event:', value);
  // Add your event handling logic here
};

/**
 * Template service event registry
 * Maps event keys to their handlers
 *
 * @example
 * Add new handlers like this:
 * ['user.created', handleUserCreated],
 * ['order.placed', handleOrderPlaced],
 */
export const templateEventRegistry = new Map<string, EventHandler>([
  // Add your event handlers here
  // ['event.key', handlerFunction],
  ['example.event', handleExampleEvent],
]);
