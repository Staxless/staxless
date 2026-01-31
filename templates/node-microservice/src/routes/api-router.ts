/**
 * @file api-router.ts
 * @description Main API router for template-service.
 * Add your service-specific routes here.
 */

import type { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

/**
 * GET /api
 * Root API endpoint - returns service info
 */
router.get('/', (_req: Request, res: Response): void => {
  res.json({
    service: 'template-service',
    version: '1.0.0',
    status: 'running',
  });
});

/**
 * Example endpoint - replace with your own routes
 * GET /api/example
 */
router.get('/example', (_req: Request, res: Response): void => {
  res.json({
    message: 'This is an example endpoint. Replace with your own routes.',
  });
});

/**
 * Example POST endpoint
 * POST /api/example
 */
router.post('/example', (req: Request, res: Response): void => {
  const { data } = req.body;
  res.status(201).json({
    message: 'Created',
    data,
  });
});

export default router;
