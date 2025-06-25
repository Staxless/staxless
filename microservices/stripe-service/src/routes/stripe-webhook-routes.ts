// File: /microservices/stripe-service/src/routes/stripe-webhook-routes.ts
// Action: REPLACE existing file

import express, { Request, Response } from "express";
import Stripe from "stripe";
import { createProducer } from "../config/kafka-client";

const router = express.Router();
const producer = createProducer();

// Make sure your Stripe webhook secret is loaded from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Fulfill the purchase
    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId;
      if (!userId) {
        console.error("Webhook Error: userId missing in session metadata.");
        return res.status(400).send("User ID missing.");
      }
      
      const subscriptionType = session.line_items?.data[0].description.toLowerCase() || "paid";
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      try {
        await producer.connect();
        await producer.send({
          topic: 'payment-events',
          messages: [{
            key: 'user.subscription.updated',
            value: JSON.stringify({
              id: userId,
              subscriptionType,
              endDate: endDate.toISOString(),
            })
          }]
        });
        console.log(`Produced subscription update event for user ${userId}`);
      } catch (kafkaError) {
        console.error('Failed to produce Kafka event for subscription update', kafkaError);
        // Depending on your requirements, you might want to return a 500 error here
        // to have Stripe retry the webhook.
        return res.status(500).send('Internal server error while processing payment event.');
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;