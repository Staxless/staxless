import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';
import { createProducer } from '../config/kafka-client';
import { handleEvent } from '../lib/stripe-webhook-handlers';

const router = express.Router();
const producer = createProducer();

// Check for required environment variables
if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error('Missing STRIPE_PRIVATE_KEY');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2024-04-10',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).send('Missing Stripe signature header');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    try {
      await handleEvent(event, stripe, producer);
      res.json({ received: true });
    } catch (error) {
      res.status(500).send(`Webhook Error: ${(error as Error).message}`);
    }
  }
);

export default router;
