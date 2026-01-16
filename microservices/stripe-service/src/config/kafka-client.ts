// src/config/kafka-client.ts
import {
  type Consumer,
  Kafka,
  logLevel,
  Partitioners,
  type Producer,
} from 'kafkajs';

/**
 * Singleton Kafka client with exponential back-off retries.
 */
class KafkaClient {
  private static instance: KafkaClient;
  private readonly kafka: Kafka;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'staxless-app',
      brokers: (process.env.KAFKA_BROKERS || 'kafka-service:9092').split(','),
      connectionTimeout: 10_000,
      requestTimeout: 30_000,
      retry: {
        initialRetryTime: 300,
        maxRetryTime: 30_000,
        multiplier: 2, // Changed from 'factor' to 'multiplier'
        retries: 8,
      },
      logLevel: logLevel.ERROR, // Changed from WARN to reduce noise
    });
  }

  static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  producer(): Producer {
    return this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner, // Silences the warning
      allowAutoTopicCreation: true,
      idempotent: false,
      maxInFlightRequests: 5,
      transactionTimeout: 60_000,
      retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 30_000,
      },
    });
  }

  consumer(groupId: string): Consumer {
    return this.kafka.consumer({
      groupId,
      sessionTimeout: 30_000,
      heartbeatInterval: 3000,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
    });
  }
}

// Export helpers
export const createProducer = (): Producer =>
  KafkaClient.getInstance().producer();

export const createConsumer = (groupId: string): Consumer =>
  KafkaClient.getInstance().consumer(groupId);

export const kafkaClient = KafkaClient.getInstance();
