import express, { type Request, type Response, type Router } from 'express';
import Stripe from 'stripe';

const router: Router = express.Router();
if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error('Missing STRIPE_PRIVATE_KEY');
}
const stripe: Stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

interface CheckoutRequest {
  productId: string;
  quantity: number;
}

router.post('/cancel-subscription', async (req: Request, res: Response) => {
  const { subscriptionId } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({ error: 'Subscription ID is required' });
  }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return res
      .status(200)
      .json({ message: 'Subscription cancellation requested' });
  } catch {
    return res.status(500).json({
      error: 'Failed to cancel subscription',
    });
  }
});
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });
    const formattedProducts = products.data.map((product: Stripe.Product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      default_price: product.default_price,
      features: product.metadata.features
        ? JSON.parse(product.metadata.features)
        : [],
    }));
    res.json(formattedProducts);
  } catch (_error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/checkout',
  async (req: Request<unknown, unknown, CheckoutRequest>, res: Response) => {
    const { productId, quantity } = req.body;
    const userInfoString = req.headers['x-user-info'] as string;

    if (!userInfoString) {
      return res.status(400).json({ error: 'User information not found' });
    }

    let userInfo: { user_id: string };
    try {
      userInfo = JSON.parse(userInfoString);
    } catch {
      return res.status(400).json({ error: 'Invalid user information' });
    }

    try {
      const product = await stripe.products.retrieve(productId);
      if (!product.default_price) {
        return res.status(400).json({ error: 'Product has no default price' });
      }
      const price = await stripe.prices.retrieve(
        product.default_price as string
      );

      // Determine the mode based on whether the Price is recurring
      const isRecurring = price.recurring !== null;
      const mode = isRecurring ? 'subscription' : 'payment';

      // Check if customer exists in Stripe
      const desiredCustomerId = `cust_${userInfo.user_id}`;
      let customerId: string;
      try {
        // Attempt to retrieve customer by desired ID
        const existingCustomer =
          await stripe.customers.retrieve(desiredCustomerId);
        customerId = existingCustomer.id;
      } catch (error) {
        // If customer doesn't exist, create a new one
        if (
          error.type === 'StripeInvalidRequestError' &&
          error.code === 'resource_missing'
        ) {
          const customer = await stripe.customers.create({
            id: desiredCustomerId,
          });
          customerId = customer.id;
        } else {
          throw error; // Rethrow other errors
        }
      }

      // Configure the Checkout session
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        mode,
        customer: customerId, // Use the customer ID (existing or newly created)
        line_items: [
          {
            price: price.id,
            quantity,
          },
        ],
        metadata: { userId: userInfo.user_id }, // Add userId to session metadata
        success_url: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/checkout`,
      };

      // Add subscription_data for recurring payments
      if (isRecurring) {
        sessionConfig.subscription_data = {
          metadata: { userId: userInfo.user_id }, // Add userId to subscription metadata
        };
      }

      // Create the Checkout session
      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.json({ url: session.url });
    } catch {
      res.status(500).json({ error: 'Failed to create checkout session,' });
    }
  }
);

export default router;
