/**
 * @file middleware/request-logger.ts
 * @description Request logging middleware for Express
 */

import type { NextFunction, Request, Response } from 'express';

/**
 * Logs incoming HTTP requests
 * Format: [timestamp] METHOD /path - status (duration)
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};
