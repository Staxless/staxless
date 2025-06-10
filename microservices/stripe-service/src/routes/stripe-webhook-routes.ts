import express, { Router, Request, Response } from "express";
import Stripe from "stripe";
import axios, { AxiosResponse } from "axios";

const router: Router = express.Router();
const stripe: Stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);
const STRIPE_WEBHOOK_SECRET: string = process.env.STRIPE_WEBHOOK_SECRET!;

interface WebhookRequest extends Request {
  body: Buffer;
}

router.post("/webhook", express.raw({ type: "application/json" }), async (req: WebhookRequest, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    console.log("✅ Webhook verified:", event.id);
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });

      if (retrievedSession.payment_status === "paid") {
        const userId = session.metadata?.userId;
        const subscriptionType = session.line_items?.data[0].description.toLowerCase() || "free";
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        const response: AxiosResponse = await axios.post(`http://user-service:8082/update-subscription`, {
          id: userId,
          subscriptionType,
          endDate: endDate.toISOString(),
        });

        console.log(`Updated subscription for user ${userId}:`, response.data);
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error("❌ Error processing webhook:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;