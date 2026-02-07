/**
 * @file api-router.ts
 * @description Minimal API router for github-service (event-driven backend service)
 */

import type { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

/**
 * GET /api
 * Service info endpoint
 */
router.get('/', (_req: Request, res: Response): void => {
  res.json({
    service: 'github-service',
    version: '1.0.0',
    status: 'running',
    description: 'Event-driven service for managing GitHub repository access',
  });
});

export default router;
