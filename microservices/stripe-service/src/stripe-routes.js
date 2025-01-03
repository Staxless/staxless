/**
 * @file stripe-routes.js
 * @description Express router for Stripe integration, handling product listing, checkout, and order success.
 * @module stripeRoutes
 */

import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

/**
 * Retrieve and format active Stripe products.
 * @route GET /products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/products", async (req, res) => {
  try {
    const { limit, starting_after, ending_before } = req.query;

    const products = await stripe.products.list({
      active: true,
      limit: limit,
      starting_after: starting_after,
      ending_before: ending_before,
      expand: ["data.default_price"],
    });

    const formattedProducts = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      default_price: product.default_price,
      features: product.metadata.features
        ? JSON.parse(product.metadata.features)
        : [],
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Handle successful order completion.
 * @route GET /order/success
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/order/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);

  res.send(
    `<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`,
  );
});

/**
 * Create a Stripe checkout session for a product.
 * @route POST /checkout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post("/checkout", bodyParser.json(), async (req, res) => {
  console.log(req.body);
  const { productId, quantity } = req.body;
  const userInfoString = req.headers["x-user-info"];
  console.log(userInfoString);

  if (!userInfoString) {
    return res.status(400).json({ error: "User information not found" });
  }

  let userInfo;
  try {
    userInfo = JSON.parse(userInfoString);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return res.status(400).json({ error: "Invalid user information" });
  }

  if (!userInfo.id) {
    return res.status(400).json({ error: "User ID not found" });
  }

  try {
    const product = await stripe.products.retrieve(productId);
    console.log(product);
    const price = await stripe.prices.retrieve(product.default_price);
    console.log(price);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: quantity,
        },
      ],
      success_url: `http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/checkout`,
      metadata: {
        userId: userInfo.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
