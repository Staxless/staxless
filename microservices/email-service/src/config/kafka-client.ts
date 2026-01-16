// src/config/kafka-client.ts
import { type Consumer, Kafka, logLevel, type Producer } from 'kafkajs';

/**
 * Singleton Kafka client with exponential back-off retries.
 */
class KafkaClient {
  private static instance: KafkaClient;
  private readonly kafka: Kafka;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'staxless-app',
      brokers: ['kafka-service:9092'],
      connectionTimeout: 3000,
      requestTimeout: 25_000,
      retry: {
        initialRetryTime: 300,
        maxRetryTime: 30_000,
        factor: 2,
        retries: 15, // ~3–4 min total
      },
      logLevel: logLevel.WARN,
    });

    // Optional: connection diagnostics (dev/staging only)
  }

  static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  producer(): Producer {
    return this.kafka.producer();
  }

  consumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}

// Export helpers
export const createProducer = (): Producer =>
  KafkaClient.getInstance().producer();
export const createConsumer = (groupId: string): Consumer =>
  KafkaClient.getInstance().consumer(groupId);

export const kafkaClient = KafkaClient.getInstance();
