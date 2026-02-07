/**
 * @file auth-providers.config.ts
 * @description Centralized configuration for all authentication providers.
 * This is the single source of truth for enabling/disabling auth methods.
 *
 * @exports
 * - authProvidersConfig: Configuration object for all auth providers
 * - getEnabledOAuthProviders: Returns list of enabled OAuth providers
 * - isMagicLinkEnabled: Checks if magic link auth is enabled
 * - getAllEnabledProviders: Returns all enabled auth methods for frontend
 *
 * @example
 * import { authProvidersConfig, getAllEnabledProviders } from './auth-providers.config';
 *
 * // Check if magic link is enabled
 * if (authProvidersConfig.magicLink.enabled) {
 *   // Show magic link option
 * }
 *
 * // Get all enabled providers for API response
 * const enabledProviders = getAllEnabledProviders();
 */

/**
 * Centralized authentication providers configuration.
 * Toggle any auth method by setting enabled to true/false.
 */
export const authProvidersConfig = {
  /**
   * Magic Link (passwordless email) authentication
   */
  magicLink: {
    enabled: false,
    displayName: 'Email Magic Link',
    description: 'Sign in with a magic link sent to your email',
  },

  /**
   * OAuth providers configuration
   */
  oauth: {
    github: {
      enabled: true,
      displayName: 'GitHub',
      description: 'Sign in with your GitHub account',
    },
    google: {
      enabled: false,
      displayName: 'Google',
      description: 'Sign in with your Google account',
    },
    microsoft: {
      enabled: false,
      displayName: 'Microsoft',
      description: 'Sign in with your Microsoft account',
    },
    discord: {
      enabled: false,
      displayName: 'Discord',
      description: 'Sign in with your Discord account',
    },
    twitter: {
      enabled: false,
      displayName: 'Twitter',
      description: 'Sign in with your Twitter account',
    },
  },
} as const;

/**
 * Returns a list of enabled OAuth provider names.
 * @returns Array of enabled OAuth provider names
 */
export function getEnabledOAuthProviders(): string[] {
  return Object.entries(authProvidersConfig.oauth)
    .filter(([_, config]) => config.enabled)
    .map(([name]) => name);
}

/**
 * Checks if magic link authentication is enabled.
 * @returns True if magic link is enabled
 */
export function isMagicLinkEnabled(): boolean {
  return authProvidersConfig.magicLink.enabled;
}

/**
 * Returns all enabled authentication methods formatted for frontend consumption.
 * This is the unified response for the /auth/providers endpoint.
 *
 * @returns Object containing all enabled auth methods by category
 */
export function getAllEnabledProviders() {
  const result: {
    magicLink?: { enabled: boolean; displayName: string; description: string };
    oauth: Array<{ name: string; displayName: string; description: string }>;
  } = {
    oauth: [],
  };

  // Add magic link if enabled
  if (authProvidersConfig.magicLink.enabled) {
    result.magicLink = {
      enabled: true,
      displayName: authProvidersConfig.magicLink.displayName,
      description: authProvidersConfig.magicLink.description,
    };
  }

  // Add enabled OAuth providers
  result.oauth = Object.entries(authProvidersConfig.oauth)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({
      name,
      displayName: config.displayName,
      description: config.description,
    }));

  return result;
}
