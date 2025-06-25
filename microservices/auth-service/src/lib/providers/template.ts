/**
 * Template OAuth provider implementation.
 *
 * Description:
 * This file serves as a template for creating new OAuth provider subclasses.
 * Developers can copy this file, rename it, and update the configuration to
 * support new providers. It uses environment variables directly, and the default
 * `createProviderInstance` is suitable for standard OAuth 2.0 flows.
 *
 * Dependencies:
 * - providerTypes.ts: Provides `Provider` and `ProviderConfig`.
 *
 * Environment Variables:
 * - TEMPLATE_CLIENT_ID: OAuth client ID for the new provider.
 * - TEMPLATE_CLIENT_SECRET: OAuth client secret for the new provider.
 * - REDIRECT_URI: Shared redirect URI for OAuth callbacks.
 *
 * Usage:
 * - Copy this file to `src/config/providers/<provider>.ts` (e.g., `twitch.ts`).
 * - Update the `config` object with provider-specific details and environment variables.
 * - Override `createProviderInstance` if custom logic or an Arctic-specific class is needed.
 * - Register the new provider in `oauth-config.ts`.
 *
 * Example:
 * cp template.ts twitch.ts
 * # Edit twitch.ts to set TWITCH_CLIENT_ID, TWITCH_REDIRECT_URI, etc.
 */
import { Provider, ProviderConfig } from "../providerTypes";

const config: ProviderConfig = {
  clientId: process.env.TEMPLATE_CLIENT_ID ?? "",
  clientSecret: process.env.TEMPLATE_CLIENT_SECRET ?? "",
  userInfoUrl: "https://api.example.com/user",
  scopes: [],
  usePKCE: false,
};

/**
 * Template OAuth provider class.
 *
 * @extends Provider
 * @example
 * const template = new TemplateProvider();
 * // Access template.instance, template.userInfoUrl, etc.
 */
export class TemplateProvider extends Provider {
  /**
   * Creates a new template provider instance.
   */
  constructor() {
    super(config, "template");
  }
}