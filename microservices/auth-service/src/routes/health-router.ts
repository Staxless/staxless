/**
 * @file health-router.ts
 * @description Express router for health check endpoints in the authentication service.
 * Provides a simple `/health` endpoint to verify server uptime and status.
 * @module healthRouter
 */

import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

router.get(
  '/health',
  (_req: Request, res: Response, _next: NextFunction): void => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
    };

    try {
      res.status(200).json(healthcheck);
    } catch (error) {
      res.status(503).json({ message: 'Service Unavailable', error });
    }
  }
);

export default router;
