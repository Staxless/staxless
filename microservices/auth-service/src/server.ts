/**
 * @file server.ts
 * @description Node.js server for authentication service using Lucia and OAuth providers.
 * @module server
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { initializeDatabase } from './config/db-config.js';
import { startAuthConsumer } from './consumers/index.js';
import authRoutes from './routes/auth-router.js';
import healthCheckRoutes from './routes/health-router.js';
import magicLinkRoutes from './routes/magic-link-router.js';
import oauthRoutes from './routes/oauth-router.js';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

/**
 * The Express application instance.
 * @type {Express}
 */
const app: Express = express();
// Middleware
/**
 * Middleware to log incoming request details.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(`Incoming request: ${_req.method} ${_req.url}`);
  next();
});

/**
 * Middleware to parse JSON request bodies.
 */
app.use(express.json());

/**
 * Middleware to enable CORS with configured origin and credentials.
 * @remarks Uses the FRONTEND_URL environment variable or defaults to http://localhost:3000.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
/**
 * Mounts health check routes at the root path.
 */
app.use('/', healthCheckRoutes);

/**
 * Mounts OAuth-related routes at /auth.
 */
app.use('/oauth/', oauthRoutes);

/**
 * Mounts OAuth-related routes at /auth.
 */
app.use('/auth', magicLinkRoutes);

/**
 * Mounts authentication routes at the root path.
 */
app.use('/', authRoutes);

/**
 * The port number for the server, sourced from environment variables or defaulting to 8080.
 * @type {string | number}
 */
const PORT = process.env.PORT || 8080;

async function initializeKafka() {
  const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false';
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds
  const INITIAL_DELAY = 2000; // Wait 2 seconds before first attempt

  if (!KAFKA_ENABLED) {
    console.log('Kafka is disabled via KAFKA_ENABLED env var');
    return;
  }

  // Give database time to fully initialize
  console.log(
    `Waiting ${INITIAL_DELAY / 1000}s before starting Kafka consumer...`
  );
  await new Promise((resolve) => setTimeout(resolve, INITIAL_DELAY));

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(
        `Attempting to start Kafka consumer (attempt ${retries + 1}/${MAX_RETRIES})...`
      );
      await startAuthConsumer();
      console.log('✅ Kafka consumer started successfully');
      return;
    } catch (error) {
      retries++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(
        `⚠️  Kafka connection failed (attempt ${retries}/${MAX_RETRIES}): ${errorMsg}`
      );

      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error(
          '❌ Failed to connect to Kafka after maximum retries. Service will continue without Kafka consumer.'
        );
      }
    }
  }
}

/**
 * Initialize services and start server
 */
async function startServer() {
  try {
    // 1. Initialize database first (critical)
    console.log('Connecting to database...');
    await initializeDatabase();
    console.log('✅ Database connected');

    // 2. Start Express server immediately
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // 3. Initialize Kafka in background (non-blocking)
    // Don't await - let it run in parallel
    initializeKafka().catch((error) => {
      console.error('Kafka initialization error:', error);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();
