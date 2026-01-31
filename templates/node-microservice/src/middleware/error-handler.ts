/**
 * @file middleware/error-handler.ts
 * @description Global error handling middleware for Express
 */

import type { NextFunction, Request, Response } from 'express';

/**
 * Custom error class with status code
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

/**
 * Global error handling middleware
 * Must be registered last in the middleware chain
 */
export const errorHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error Handler]', err.message);

  // Log stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};
