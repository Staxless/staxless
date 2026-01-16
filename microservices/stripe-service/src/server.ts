/**
 * @file server.ts
 * @description Node.js server for authentication service using Lucia and OAuth providers.
 * @module server
 */
import dotenv from 'dotenv';
import express from 'express';
import healthCheckRoutes from './routes/health-router';
import stripeRoutes from './routes/stripe-routes';
import webhookRoutes from './routes/stripe-webhook-routes';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

const app = express();
const PORT = process.env.PORT || 8083;

/**
 * Logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((_req, _res, next) => {
  next();
});

/**
 * Middleware to handle raw body parsing ONLY for webhook route
 * @remarks This MUST be before express.json() to preserve raw body for Stripe signature verification
 */
app.use('/webhook', express.raw({ type: 'application/json' }));

/**
 * Middleware to parse JSON request bodies for all other routes.
 */
app.use(express.json());

/**
 * Mounts health check routes at the root path.
 */
app.use('/', healthCheckRoutes);

/**
 * Mounts Stripe-related routes at the root path.
 * @remarks Handles Stripe payment intents, products, and prices.
 */
app.use('/', stripeRoutes);

/**
 * Mounts Stripe webhook routes at the root path.
 * @remarks Handles Stripe webhooks with raw body parsing.
 */
app.use('/', webhookRoutes);

/**
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
app.listen(PORT, () => {
  console.log(`Stripe service listening on port ${PORT}`);
});
