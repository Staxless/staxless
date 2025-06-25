/**
 * @file MicrosoftProvider.ts
 * @description Microsoft OAuth provider implementation extending the base Provider class.
 * Handles OAuth client setup and normalization of Microsoft user information via Microsoft Entra ID.
 *
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "../providerTypes";

const config: ProviderConfig = {
  clientId: process.env.MICROSOFT_CLIENT_ID ?? "",
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
  userInfoUrl: "https://graph.microsoft.com/v1.0/me",
  scopes: ["User.Read"],
  usePKCE: true,
};

/**
 * Microsoft OAuth provider class.
 *
 * Extends the base Provider class to implement Microsoft-specific OAuth flow and user info normalization.
 *
 * @extends Provider
 */
export class MicrosoftProvider extends Provider {
  constructor() {
    super(config, "microsoft");
    console.log("MicrosoftProvider Config:", {
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret ? "[REDACTED]" : undefined,
      scopes: this.config.scopes,
      redirectUri: "http://localhost:8000/oauth/microsoft/callback",
    });
  }

  /**
   * Creates an instance of the Arctic MicrosoftEntraId OAuth client.
   *
   * @protected
   * @returns {arctic.MicrosoftEntraId} Microsoft OAuth client instance.
   * @throws Will throw an error if clientId or clientSecret are missing.
   */
  protected createProviderInstance(): arctic.MicrosoftEntraId {
    const { clientId, clientSecret } = this.config;
    if (!clientId || !clientSecret) {
      throw new Error("Microsoft requires MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET");
    }
    const redirectUri = "http://localhost:8000/oauth/microsoft/callback";
     
    return new arctic.MicrosoftEntraId(clientId, clientSecret, redirectUri, { tenantId: "common" });
  }

  /**
   * Normalizes the raw Microsoft user info into a standard format.
   *
   * @param {any} userInfo - Raw user data from Microsoft Graph API.
   * @returns {NormalizedUserInfo} Normalized user object.
   * @throws Will throw an error if user ID is missing from the data.
   */
  public normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    const id = userInfo.id;
    const name = userInfo.displayName || null;
    const email = userInfo.userPrincipalName || null;
    const picture = null; // Microsoft Graph API typically does not provide a profile picture in this endpoint
    const fname = userInfo.givenName || name?.split(" ")[0] || null;
    const lname = userInfo.surname || name?.split(" ")[1] || null;

    if (!id) throw new Error("Missing user ID from Microsoft user info");

    return { id, name, email, picture, fname, lname };
  }
}
