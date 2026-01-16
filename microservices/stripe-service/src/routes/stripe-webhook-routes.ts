import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';
import { createProducer } from '../config/kafka-client';
import { loadSecret } from '../lib/secrets-manager.js';
import { handleEvent } from '../lib/stripe-webhook-handlers';

const router = express.Router();

// Check for required environment variables
if (!(loadSecret('STRIPE_PRIVATE_KEY') || process.env.STRIPE_PRIVATE_KEY)) {
  throw new Error('Missing STRIPE_PRIVATE_KEY');
}

if (
  !(loadSecret('STRIPE_WEBHOOK_SECRET') || process.env.STRIPE_WEBHOOK_SECRET)
) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

// Initialize Stripe
const stripe = new Stripe(
  (loadSecret('STRIPE_PRIVATE_KEY') as string) ??
    process.env.STRIPE_PRIVATE_KEY,
  {
    apiVersion: '2024-04-10',
  }
);

const webhookSecret =
  (loadSecret('STRIPE_WEBHOOK_SECRET') as string) ??
  process.env.STRIPE_WEBHOOK_SECRET;

// Create and connect Kafka producer once
const producer = createProducer();
let isProducerConnected = false;

// Connect producer on startup
(async () => {
  try {
    await producer.connect();
    isProducerConnected = true;
    console.log('✅ Kafka producer connected successfully');
  } catch (error) {
    console.error('⚠️  Failed to connect Kafka producer:', error);
    console.warn(
      '⚠️  Webhooks will be processed but events will not be sent to Kafka'
    );
  }
})();

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, disconnecting Kafka producer...');
  try {
    await producer.disconnect();
    console.log('✅ Kafka producer disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Kafka producer:', error);
  }
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, disconnecting Kafka producer...');
  try {
    await producer.disconnect();
    console.log('✅ Kafka producer disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Kafka producer:', error);
  }
  process.exit(0);
});

/**
 * Stripe webhook endpoint
 * @remarks Handles incoming Stripe webhook events with signature verification
 */
router.post('/webhook', (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('❌ Missing Stripe signature header');
    return res.status(400).send('Missing Stripe signature header');
  }

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('✅ Webhook verified:', event.type, '| ID:', event.id);
  } catch (err) {
    const error = err as Error;
    console.error('❌ Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Respond to Stripe immediately to acknowledge receipt
  res.json({ received: true });

  // Process event asynchronously (don't block webhook response)
  if (isProducerConnected) {
    handleEvent(event, stripe, producer)
      .then(() => {
        console.log('✅ Event processed successfully:', event.type);
      })
      .catch((error) => {
        console.error('❌ Event processing failed:', event.type, error);
      });
  } else {
    console.warn(
      '⚠️  Kafka producer not connected, skipping event processing for:',
      event.type
    );
    console.warn('⚠️  Event data:', JSON.stringify(event, null, 2));
  }
});

export default router;
