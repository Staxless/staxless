/**
 * @file API Configuration
 * @description Centralized API gateway URL configuration for server-side requests
 */

/**
 * Get the API gateway URL from environment variable or fallback to Docker internal URL
 * In production: uses API_GATEWAY_URL (e.g., https://api.staxless.com)
 * In development: falls back to Docker internal network URL
 */
export function getApiGatewayUrl(): string {
  return 'http://kong-api-gateway:8000';
}
