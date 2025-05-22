/*
  Description:
  This file serves as the central configuration for managing OAuth providers.
  It exports an object that maps provider names to their corresponding
  provider configurations. Developers can add or remove providers from this central
  location as needed.

  Dependencies:
  - arctic (OAuth provider module)
  - Environment variables: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI

  Usage:
  - Import `providers` to access configured provider instances and metadata.
  - Use `getConfiguredProviders` to retrieve a list of available providers.
  - Extend the `providers` object to add new OAuth providers.
*/

import { Google } from "arctic";
import GitHubProvider from "../providers/githubProvider.js";


/**
 * An object mapping provider names to their corresponding provider configurations.
 *
 * @type {Object}
 * @property {Object} github - The GitHub OAuth provider configuration, including
 *   provider instance, user info URL, name, and scopes.
 * @property {Object} google - The Google OAuth provider configuration, including
 *   provider instance, user info URL, name, and scopes.
 */
export const providers = {
  github: GitHubProvider(),
};

/**
 * Fetches the list of configured OAuth providers.
 *
 * @returns {Array} A list of provider configurations, including their names and metadata.
 * @example
 * getConfiguredProviders(); // [{ name: "github" }, { name: "google" }]
 */
export const getConfiguredProviders = () => {
  return Object.keys(providers).map((providerName) => ({
    name: providerName,
    userInfoUrl: providers[providerName].userInfoUrl,
    scopes: providers[providerName].scopes,
  }));
};