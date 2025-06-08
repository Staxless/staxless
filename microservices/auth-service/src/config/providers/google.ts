/**
 * @file GoogleProvider.ts
 * @description Google OAuth provider implementation extending the base Provider class.
 * Handles OAuth client setup and normalization of Google user information.
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "../providerTypes";

const config: ProviderConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
  scopes: ["profile", "email", "openid"],
  usePKCE: true,
};

/**
 * Google OAuth provider class.
 *
 * Extends the base Provider class to implement Google-specific OAuth flow and user info normalization.
 *
 * @extends Provider
 */
export class GoogleProvider extends Provider {
  constructor() {
    super(config, "google");
    console.log("GoogleProvider Config:", {
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret ? "[REDACTED]" : undefined,
      scopes: this.config.scopes,
      redirectUri: "http://localhost:8000/oauth/google/callback",
    });
  }

  /**
   * Creates an instance of the Arctic Google OAuth client.
   * 
   * @protected
   * @returns {arctic.Google} Google OAuth client instance.
   * @throws Will throw an error if clientId or clientSecret are missing.
   */
  protected createProviderInstance(): arctic.Google {
    const { clientId, clientSecret } = this.config;
    if (!clientId || !clientSecret) {
      throw new Error("Google requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
    }
    const redirectUri = "http://localhost:8000/oauth/google/callback";
    console.log("Google Provider Instance Created with Redirect URI:", redirectUri, "Scopes:", this.config.scopes);
    return new arctic.Google(clientId, clientSecret, redirectUri);
  }

  /**
   * Normalizes the raw Google user info into a standard format.
   * 
   * @param {any} userInfo - Raw user data from Google API.
   * @returns {NormalizedUserInfo} Normalized user object.
   * @throws Will throw an error if user ID is missing from the data.
   */
  public normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    const id = userInfo.sub;
    const name = userInfo.name || null;
    const email = userInfo.email || null;
    const picture = userInfo.picture || null;
    const fname = userInfo.given_name || name?.split(" ")[0] || null;
    const lname = userInfo.family_name || name?.split(" ")[1] || null;

    if (!id) throw new Error("Missing user ID from Google user info");

    return { id, name, email, picture, fname, lname };
  }
}
