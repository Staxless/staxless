/**
 * @file server.ts
 * @description Node.js server for github-service microservice.
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
import { startGithubConsumer } from './consumers/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import healthRoutes from './routes/health-router.js';
import apiRoutes from './routes/api-router.js';
import changelogRoutes from './routes/changelog-router.js';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

/**
 * The Express application instance.
 * @type {Express}
 */
const app: Express = express();

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/', healthRoutes);
app.use('/api', apiRoutes);
app.use('/github', changelogRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

/**
 * The port number for the server, sourced from environment variables or defaulting to 8080.
 * @type {string | number}
 */
const PORT = process.env.PORT || 8085;

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
      await startGithubConsumer();
      console.log('Kafka consumer started successfully');
      return;
    } catch (error) {
      retries++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(
        `Kafka connection failed (attempt ${retries}/${MAX_RETRIES}): ${errorMsg}`
      );

      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error(
          'Failed to connect to Kafka after maximum retries. Service will continue without Kafka consumer.'
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
    console.log('Database connected');

    // 2. Start Express server immediately
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // 3. Initialize Kafka in background (non-blocking)
    // Don't await - let it run in parallel
    initializeKafka().catch((error) => {
      console.error('Kafka initialization error:', error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
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
