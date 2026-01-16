/**
 * @file server.ts
 * @description Node.js server for email service with non-blocking Kafka initialization.
 * @module server
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { startEmailConsumer } from './consumers/index.js';
import healthCheckRoutes from './routes/health-router.js';

// Load environment variables
dotenv.config({ path: './secrets/.env' });

const app = express();
const PORT = process.env.PORT || 8084;

/**
 * Middleware to parse JSON request bodies.
 */
app.use(express.json());

/**
 * Middleware to enable CORS with configured origin and credentials.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/', healthCheckRoutes);

/**
 * Initialize Kafka consumer in background (non-blocking)
 */
async function initializeKafka() {
  const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false';
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds
  const INITIAL_DELAY = 2000; // Wait 2 seconds before first attempt

  if (!KAFKA_ENABLED) {
    console.log('Kafka is disabled via KAFKA_ENABLED env var');
    return;
  }

  // Give services time to start
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
      await startEmailConsumer();
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
function startServer() {
  try {
    // Start Express server immediately
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // Initialize Kafka in background (non-blocking)
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
