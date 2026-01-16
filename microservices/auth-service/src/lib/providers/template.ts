/**
 * @file TemplateProvider.ts
 * @description Template OAuth provider implementation.
 *
 * This file serves as a template for creating new OAuth provider subclasses.
 * Developers can copy this file, rename it, and update the configuration to
 * support new providers. It uses environment variables directly, and the default
 * `createProviderInstance` is suitable for standard OAuth 2.0 flows.
 *
 * @dependencies
 * - provider-types.ts: Provides `Provider`, `ProviderConfig`, and `NormalizedUserInfo`.
 * - arctic: OAuth client library for handling OAuth flows.
 *
 * @environmentVariables
 * - TEMPLATE_CLIENT_ID: OAuth client ID for the new provider.
 * - TEMPLATE_CLIENT_SECRET: OAuth client secret for the new provider.
 * - REDIRECT_URI: Shared redirect URI for OAuth callbacks (e.g., "http://localhost:8000/oauth/template/callback").
 *
 * @usage
 * - Copy this file to `src/config/providers/<provider>.ts` (e.g., `twitch.ts`).
 * - Update the `config` object with provider-specific details (clientId, clientSecret, userInfoUrl, scopes).
 * - Update environment variable names (e.g., TWITCH_CLIENT_ID instead of TEMPLATE_CLIENT_ID).
 * - Override `createProviderInstance` if a provider-specific Arctic class is available or custom OAuth endpoints are needed.
 * - Customize `normalizeUserInfo` to map provider-specific user data to the `NormalizedUserInfo` interface.
 * - Register the new provider in `oauth-config.ts`.
 *
 * @example
 * ```bash
 * cp TemplateProvider.ts TwitchProvider.ts
 * # Edit TwitchProvider.ts to set TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, etc.
 * ```
 */
import * as arctic from 'arctic';
import { Provider, type ProviderConfig, type NormalizedUserInfo } from './provider-types.js';

// Provider-specific configuration
const config: ProviderConfig = {
  clientId: process.env.TEMPLATE_CLIENT_ID ?? '',
  clientSecret: process.env.TEMPLATE_CLIENT_SECRET ?? '',
  userInfoUrl: 'https://api.example.com/user', // Replace with provider's user info endpoint
  scopes: [], // Replace with provider-specific scopes (e.g., ['user:read:email'])
  usePKCE: false, // Set to true if PKCE is required
};

/**
 * Template OAuth provider class.
 *
 * Extends the base Provider class to implement a generic OAuth flow and user info normalization.
 *
 * @extends Provider
 * @example
 * const template = new TemplateProvider();
 * // Access template.instance, template.userInfoUrl, etc.
 */
export class TemplateProvider extends Provider {
  constructor() {
    super(config, 'template');
  }

  /**
   * Creates an instance of the Arctic OAuth client for the provider.
   *
   * @protected
   * @returns {arctic.OAuth2Client} Generic OAuth2 client instance.
   * @throws Will throw an error if clientId or clientSecret are missing.
   */
  // @ts-ignore
  protected createProviderInstance(): arctic.OAuth2Client {
    const { clientId, clientSecret } = this.config;
    if (!clientId || !clientSecret) {
      throw new Error('Template provider requires TEMPLATE_CLIENT_ID and TEMPLATE_CLIENT_SECRET');
    }
    const redirectUri = process.env.REDIRECT_URI ?? 'http://localhost:8000/oauth/template/callback';
    // Generic OAuth2Client; override if provider-specific class is available
    // @ts-ignore
    return new arctic.OAuth2Client(clientId, clientSecret, {
      redirectUri,
      // Replace with provider-specific endpoints
      authorizeEndpoint: 'https://accounts.example.com/oauth/authorize',
      tokenEndpoint: 'https://accounts.example.com/oauth/token',
    });
  }

  /**
   * Normalizes the raw user info into a standard format.
   *
   * @param {any} userInfo - Raw user data from the provider's API.
   * @returns {NormalizedUserInfo} Normalized user object.
   * @throws Will throw an error if user ID is missing from the data.
   */
  public normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    const id = userInfo.id || null; // Replace with provider-specific field (e.g., userInfo.sub)
    const name = userInfo.name || null; // Replace with provider-specific field
    const email = userInfo.email || null; // Replace with provider-specific field
    const picture = userInfo.picture || null; // Replace with provider-specific field
    const fname = userInfo.given_name || name?.split(' ')[0] || null; // Replace with provider-specific field
    const lname = userInfo.family_name || name?.split(' ')[1] || null; // Replace with provider-specific field

    if (!id) throw new Error('Missing user ID from template provider user info');

    return { id, name, email, picture, fname, lname };
  }
}