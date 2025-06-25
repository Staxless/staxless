import { Kafka, Producer, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'staxless-app',
  brokers: ['kafka:29092'] // Internal Docker network address for Kafka
});

// A function to create a producer
export const createProducer = (): Producer => {
  return kafka.producer();
};

// A function to create a consumer for a specific group
export const createConsumer = (groupId: string): Consumer => {
  return kafka.consumer({ groupId });
};