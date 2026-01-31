/**
 * @file oauth-config.ts
 * @description Exports OAuth providers and utility functions for managing configured providers.
 * Provider availability is controlled by auth-providers.config.ts.
 *
 * @exports
 * - providers: An object mapping provider names to their Provider instances.
 * - getConfiguredProviders: Returns an array of enabled provider names with display names.
 *
 * @example
 * import { providers, getConfiguredProviders } from './oauth-config';
 *
 * // Get list of configured providers for UI display
 * const providerList = getConfiguredProviders();
 *
 * // Output: [{ name: 'github', displayName: 'GitHub' }, { name: 'google', displayName: 'Google' }]
 *
 * // Use a specific provider instance for OAuth operations
 * const githubProvider = providers.github;
 * // e.g., githubProvider.normalizeUserInfo(userInfo)
 */

import { getEnabledOAuthProviders } from './auth-providers.config.js';
import { GitHubProvider } from '../lib/providers/github.js';
import { GoogleProvider } from '../lib/providers/google.js';
import type { Provider } from '../lib/providers/provider-types.js';

// All available provider instances
const allProviders: { [key: string]: Provider } = {
  github: new GitHubProvider(),
  google: new GoogleProvider(),
  // microsoft: new MicrosoftProvider(),
  // discord: new DiscordProvider(),
  // twitter: new TwitterProvider(),
};

/**
 * Active providers filtered by auth-providers.config.ts
 * Only includes providers that are enabled in the centralized config.
 */
export const providers: { [key: string]: Provider } = Object.fromEntries(
  getEnabledOAuthProviders()
    .filter((name) => allProviders[name])
    .map((name) => [name, allProviders[name]])
);

/**
 * Returns an array of enabled providers with their keys and display names.
 * Filtered by auth-providers.config.ts settings.
 *
 * @returns {Array<{name: string, displayName: string}>} List of enabled providers.
 */
export function getConfiguredProviders() {
  return Object.keys(providers).map((name) => ({
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
  }));
}
