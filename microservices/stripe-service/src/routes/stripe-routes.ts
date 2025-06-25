import express, { Router, Request, Response } from "express";
import Stripe from "stripe";

const router: Router = express.Router();
const stripe: Stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

interface CheckoutRequest {
  productId: string;
  quantity: number;
}

router.get("/products", async (_req: Request, res: Response) => {
  try {
    const products = await stripe.products.list({ active: true, expand: ["data.default_price"] });
    const formattedProducts = products.data.map((product: Stripe.Product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      default_price: product.default_price,
      features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/checkout", async (req: Request<{}, {}, CheckoutRequest>, res: Response) => {
  const { productId, quantity } = req.body;
  const userInfoString = req.headers["x-user-info"] as string;
  console.log("User Info String:", userInfoString);

  if (!userInfoString) {
    return res.status(400).json({ error: "User information not found" });
  }

  let userInfo: { user_id: string };
  try {
    userInfo = JSON.parse(userInfoString);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return res.status(400).json({ error: "Invalid user information" });
  }

  console.log("Parsed User Info:", userInfo);
  try {
    const product = await stripe.products.retrieve(productId);
    const price = await stripe.prices.retrieve(product.default_price as string);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: price.id, quantity }],
      success_url: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
      metadata: { userId: userInfo.user_id },
    });

    console.log("Stripe session metadata:", session.metadata);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;