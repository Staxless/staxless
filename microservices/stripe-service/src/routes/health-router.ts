import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

interface HealthCheck {
  uptime: number;
  message: string;
  timestamp: string;
  stripeConnected?: boolean;
}

router.get(
  '/health',
  async (_req: Request, res: Response, _next: NextFunction) => {
    const healthcheck: HealthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toLocaleString(),
    };

    try {
      // Secure Stripe connection check: attempt to retrieve account balance
      await stripe.accounts.retrieve();
      healthcheck.stripeConnected = true;
    } catch (_error) {
      healthcheck.message = 'Stripe connection failed';
      healthcheck.stripeConnected = false;
      res.status(503).send(healthcheck);
      return;
    }

    res.send(healthcheck);
  }
);

export default router;
