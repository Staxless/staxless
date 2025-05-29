/**
 * @file oauth-config.ts
 * @description Exports OAuth providers and utility functions for managing configured providers.
 * Includes GitHub and Google providers by default; others can be added by uncommenting.
 * 
 * @exports
 * - providers: An object mapping provider names to their Provider instances.
 * - getConfiguredProviders: Returns an array of configured provider names with display names.
 * 
 * @example
 * import { providers, getConfiguredProviders } from './index';
 * 
 * // Get list of configured providers for UI display
 * const providerList = getConfiguredProviders();
 * console.log(providerList);
 * // Output: [{ name: 'github', displayName: 'Github' }, { name: 'google', displayName: 'Google' }]
 * 
 * // Use a specific provider instance for OAuth operations
 * const githubProvider = providers.github;
 * // e.g., githubProvider.normalizeUserInfo(userInfo)
 */

import { GitHubProvider } from "./providers/github";
import { GoogleProvider } from "./providers/google";
import { Provider } from "./providerTypes";

export const providers: { [key: string]: Provider } = {
  github: new GitHubProvider(),
  google: new GoogleProvider(),
  // microsoft: new MicrosoftProvider(),
  // discord: new DiscordProvider(),
  // twitter: new TwitterProvider(),
};

/**
 * Returns an array of configured providers with their keys and display names.
 * Useful for generating UI options or debugging.
 * 
 * @returns {Array<{name: string, displayName: string}>} List of configured providers.
 */
export function getConfiguredProviders() {
  return Object.keys(providers).map((name) => ({
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
  }));
}
