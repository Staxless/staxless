/**
 * @file Error Handling Utilities
 * @description Centralized error handling utilities for the application
 */

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Result type for server actions
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create a success result
 */
export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Helper to create a failure result
 */
export function failure<T>(error: string): ActionResult<T> {
  return { success: false, error };
}

/**
 * Safe fetch wrapper with better error handling
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        `HTTP ${response.status}: ${errorText}`,
        'FETCH_ERROR',
        response.status,
        { url, method: options?.method || 'GET' }
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error instanceof Error ? error.message : 'Network request failed',
      'NETWORK_ERROR',
      undefined,
      { url, originalError: error }
    );
  }
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    if (error.statusCode === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (error.statusCode && error.statusCode >= 500) {
      return 'A server error occurred. Please try again later.';
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    name: error instanceof Error ? error.name : 'Error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError) {
    console.error('[AppError]', {
      ...errorInfo,
      code: error.code,
      statusCode: error.statusCode,
      errorContext: error.context,
    });
  } else {
    console.error('[Error]', errorInfo);
  }
}
