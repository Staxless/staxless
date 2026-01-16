/**
 * @file MicrosoftProvider.ts
 * @description Microsoft OAuth provider implementation extending the base Provider class.
 * Handles OAuth client setup and normalization of Microsoft user information via Microsoft Entra ID.
 *
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "./provider-types.js";
import { loadSecret } from "../../lib/secrets-manager.js";

const config: ProviderConfig = {
  clientId: loadSecret('MICROSOFT_CLIENT_ID') ?? process.env.MICROSOFT_CLIENT_ID ?? "",
  clientSecret: loadSecret('MICROSOFT_CLIENT_SECRET') ?? process.env.MICROSOFT_CLIENT_SECRET ?? "",
  userInfoUrl: "https://graph.microsoft.com/v1.0/me",
  scopes: ["User"],
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
    const redirectUri = `${process.env.API_GATEWAY_URL}/oauth/microsoft/callback`
     
    return new arctic.MicrosoftEntraId(clientId, clientSecret, redirectUri, "common");
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
