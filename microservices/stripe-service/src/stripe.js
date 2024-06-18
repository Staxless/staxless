/*
  stripe.js

  Description:
  Handles the checkout process by creating a Stripe checkout session.

  How to get started:
  - Ensure the `STRIPE_PRIVATE_KEY` environment variable is set in your .env file.
  - This file should be used as a route in your Express application.

  Routes:
  - POST /checkout: Handles POST request for checkout. Retrieves store items and creates a Stripe checkout session.
*/

// Import required modules and libraries
const express = require("express");
const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

/**
 * Handles POST request for checkout.
 * Retrieves store items and creates a Stripe checkout session.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post("/checkout", async (req, res) => {
  try {
    // Retrieve store items from the config database service
    const storeItems = await axios.get("http://db:8002/products/");

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // Change to "subscription" for subscription mode
      line_items: req.body.items.map((item) => {
        // Map items in the request body to Stripe line items
        const storeItem = storeItems.data.find(
          (storeItem) => storeItem.id === item.id,
        );
        if (!storeItem) {
          throw new Error(`Store item with ID ${item.id} not found.`);
        }
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "https://google.com", //`${process.env.CLIENT_URL}/success.html`
      cancel_url: "https://google.com", //`${process.env.CLIENT_URL}/cancel.html`
    });

    // Send the Stripe checkout session URL as a response
    res.json({ url: session.url });
  } catch (e) {
    // Handle errors
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
