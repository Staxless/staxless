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
import { closeDatabase, initializeDatabase } from './config/db-config';
import { auth, initializeLucia } from './config/lucia-config';
import { startAuthConsumer } from './consumers';
import authRoutes from './routes/auth-router';
import healthCheckRoutes from './routes/health-router';
import magicLinkRoutes from './routes/magic-link-router';
import oauthRoutes from './routes/oauth-router';

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

/**
 * Starts the Express server on the specified port.
 * @remarks Logs a message when the server is running.
 */
async function startServer() {
  try {
    // Initialize database and collections
    await initializeDatabase();

    await initializeLucia();

    // Start Kafka consumer
    await startAuthConsumer();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Shutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
        console.log('Server shut down');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
