/**
 * @file kafka-client.ts
 * @description Kafka client configuration for template-service
 */

import { type Consumer, Kafka, type Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'template-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka-service:9092'],
});

/**
 * Creates a Kafka producer instance
 * @returns {Producer} Kafka producer
 */
export const createProducer = (): Producer => {
  return kafka.producer();
};

/**
 * Creates a Kafka consumer instance for a specific group
 * @param groupId - Consumer group ID
 * @returns {Consumer} Kafka consumer
 */
export const createConsumer = (groupId: string): Consumer => {
  return kafka.consumer({ groupId });
};
