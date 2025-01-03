/*
  Description:
  This file serves as the central configuration for managing OAuth providers.
  It exports an object that maps provider names to their corresponding
  provider modules. Developers can add or remove providers from this central
  location as needed.

  Dependencies:
  - arctic (GitHub OAuth provider module)
  - Environment variables: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

  Usage:
  - Import `providers` to access configured provider instances.
  - Use `getConfiguredProviders` to retrieve a list of available providers.
  - Extend the `providers` object to add new OAuth providers.
*/

import { GitHub } from "arctic";

/**
 * An object mapping provider names to their corresponding provider modules.
 *
 * @type {Object}
 * @property {Object} github - The GitHub OAuth provider module, pre-configured
 *   with client ID, client secret, and additional metadata like user info URL
 *   and scopes.
 * @property {Object} [otherProviders] - Additional OAuth provider modules
 *   can be added here as needed.
 */
export const providers = {
  github: new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  ),

  // Placeholder for other providers
  // Example:
  // google: new Google(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET),
};

/**
 * Fetches the list of configured OAuth providers.
 *
 * @returns {Array} A list of provider configurations, including their names.
 * @example
 * getConfiguredProviders(); // [{ name: "github" }]
 */
export const getConfiguredProviders = () => {
  return Object.keys(providers).map((providerName) => ({
    name: providerName,
    // Add more provider-specific metadata here if needed
  }));
};

// Extend the GitHub provider with additional metadata
providers["github"].userInfoUrl = "https://api.github.com/user"; // Endpoint to fetch user information
providers["github"].name = "github"; // Provider name identifier
providers["github"].scopes = ["user:email"]; // Required OAuth scopes
