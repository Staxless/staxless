/**
 * @file stripe-webhook-routes.js
 * @description Express router for handling Stripe webhooks, particularly for processing completed checkout sessions.
 * @module stripeWebhookRoutes
 */

import express from "express";
import Stripe from "stripe";
import axios from "axios";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
/**
 * Handle Stripe webhooks.
 * @route POST /webhook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    console.log(req.body,sig)

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET,
      );
      console.log("✅ Webhook verified:", event.id);
    } catch (err) {
      console.error("❌ Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object);
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

/**
 * Handle completed checkout session.
 * @param {Object} session - The completed checkout session object
 */
async function handleCheckoutSessionCompleted(session) {
  console.log("Processing completed checkout session:", session.id);

  try {
    const retrievedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      },
    );

    if (retrievedSession.payment_status === "paid") {
      await updateUserSubscription(retrievedSession);
    } else {
      console.log(`Payment not completed for session ${session.id}`);
    }
  } catch (err) {
    console.error("Error handling checkout session:", err);
    throw err;
  }
}

/**
 * Update user subscription based on completed checkout session.
 * @param {Object} session - The completed checkout session object
 * @returns {Promise<Object>} The response from the user service
 * @throws {Error} If updating the subscription fails
 */
async function updateUserSubscription(session) {
  const userId = session.metadata.userId;
  const subscriptionType =
    session.line_items.data[0].description.toLowerCase() || "free";
  const endDate = calculateEndDate();

  try {
    const response = await axios.post(
      `http://user-service:8082/update-subscription`,
      {
        id: userId,
        subscriptionType,
        endDate,
      },
    );

    console.log(`Updated subscription for user ${userId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating subscription for user ${userId}:`, error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

/**
 * Calculate the end date for a subscription (1 year from now).
 * @returns {string} ISO string representation of the end date
 */
function calculateEndDate() {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  return oneYearFromNow.toISOString();
}

export default router;
