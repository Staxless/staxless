/**
 * @file changelog-router.ts
 * @description REST endpoint for fetching repository changelog
 */

import type { Request, Response } from 'express';
import { Router } from 'express';
import { getRepoCommits } from '../services/github-api.js';

const router = Router();

/**
 * GET /changelog
 * Returns recent commits from the Staxless repository
 * Query params:
 *   - limit: number of commits (default 15, max 50)
 */
router.get('/changelog', async (req: Request, res: Response): Promise<void> => {
  try {
    const limitParam = req.query.limit;
    const limit =
      typeof limitParam === 'string' ? parseInt(limitParam, 10) : 15;
    const safeLimit = Number.isNaN(limit) ? 15 : Math.min(Math.max(limit, 1), 50);

    const entries = await getRepoCommits(safeLimit);
    res.json({ entries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch changelog';
    console.error('[Changelog] Error fetching commits:', message);
    res.status(500).json({ error: { message } });
  }
});

export default router;
