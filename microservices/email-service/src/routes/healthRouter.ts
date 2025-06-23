/**
 * @file healthRouter.ts
 * @description Express router for health check endpoints in the authentication service.
 * Provides a simple `/health` endpoint to verify server uptime and status.
 * @module healthRouter
 */

import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

/**
 * GET /health
 *
 * Returns the health status of the server, including uptime and timestamp.
 *
 * @route GET /health
 * @param {_req} _req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @param {_next} _next - The Express next function (unused).
 * @returns {void} Sends a JSON response with health check details.
 * @throws {503} If an error occurs while sending the health check response.
 */
router.get("/health", async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: new Date().toISOString(),
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ message: "Service Unavailable", error });
  }
});

export default router;
