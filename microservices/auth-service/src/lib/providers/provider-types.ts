/**
 * @file providerTypes.ts
 * @description Defines types and an abstract base class for handling OAuth provider configuration and user data normalization.
 * Supports Arctic-based OAuth2 clients including GitHub, Google, Twitter, Spotify, and custom providers.
 * 
 * @types
 * - ProviderConfig: Configuration for initializing an OAuth provider.
 * - ArcticProvider: Union type for supported Arctic providers.
 * - NormalizedUserInfo: Standardized structure for user info returned from providers.
 * 
 * @class Provider: Abstract class that encapsulates common OAuth provider behavior.
 */

import * as arctic from "arctic";


/**
 * Configuration for initializing an OAuth provider.
 */
export interface ProviderConfig {
  clientId: string;
  clientSecret?: string | null;
  userInfoUrl: string;
  scopes?: string[];
  usePKCE?: boolean;
  customParams?: Record<string, any>;
}

/**
 * Supported Arctic OAuth2 providers or custom client instance.
 */
export type ArcticProvider = 
 | arctic.GitHub
  | arctic.Google
  | arctic.MicrosoftEntraId
  | arctic.Discord
  | arctic.Twitter
  | arctic.Spotify;


/**
 * Standardized structure for user info returned from an OAuth provider.
 */
export type NormalizedUserInfo = {
  id: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  fname: string | null;
  lname: string | null;
};

/**
 * Abstract class that defines the structure and behavior of an OAuth provider.
 */
export abstract class Provider {
  readonly instance: ArcticProvider;
  readonly userInfoUrl: string;
  readonly name: string;
  readonly scopes: string[];
  readonly usePKCE: boolean;

  /**
   * Constructs a new provider using the given configuration and name.
   * @param config - Provider-specific configuration.
   * @param name - Name of the provider (e.g., "google", "github").
   * @throws Error if required fields like clientId or userInfoUrl are missing.
   */
  constructor(protected config: ProviderConfig, name: string) {
    const { userInfoUrl, scopes = [], usePKCE = false } = config;
    // if (!config.clientId) throw new Error(`[${name}]: clientId is required`);
    // if (!userInfoUrl) throw new Error(`[${name}]: userInfoUrl is required`);

    this.instance = this.createProviderInstance();
    this.userInfoUrl = userInfoUrl;
    this.name = name.toLowerCase();
    this.scopes = scopes;
    this.usePKCE = usePKCE;
  }

  /**
   * Creates and returns a new Arctic OAuth2Client instance using config values.
   * @returns {ArcticProvider} OAuth2 client instance.
   */
  protected createProviderInstance(): ArcticProvider {
    const { clientId, clientSecret } = this.config;
    // @ts-ignore
    return new arctic.OAuth2Client(clientId, clientSecret, process.env.REDIRECT_URI);
  }

  /**
   * Normalizes user information based on provider-specific data structure.
   * @param userInfo - Raw user data from the OAuth provider.
   * @returns Normalized user object with id, name, email, picture, fname, and lname.
   * @throws Error if user ID is missing or normalization fails.
   */
  abstract normalizeUserInfo(userInfo: any): NormalizedUserInfo;
}
