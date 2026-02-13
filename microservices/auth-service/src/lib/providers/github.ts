/**
 * @file GitHubProvider.ts
 * @description GitHub OAuth provider implementation extending the base Provider class.
 * Manages OAuth client creation, configuration, and normalization of GitHub user info.
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "./provider-types.js";
import { loadSecret } from "../../lib/secrets-manager.js";

const config: ProviderConfig = {
  clientId: loadSecret('GH_OAUTH_CLIENT_ID') ?? process.env.GH_OAUTH_CLIENT_ID ?? "",
  clientSecret: loadSecret('GH_OAUTH_CLIENT_SECRET') ?? process.env.GH_OAUTH_CLIENT_SECRET ?? "",
  userInfoUrl: "https://api.github.com/user",
  scopes: ["user:email"],
  usePKCE: false,
};

/**
 * GitHub OAuth provider class.
 *
 * Extends the base Provider class to implement GitHub-specific OAuth flow and user info normalization.
 *
 * @extends Provider
 */
export class GitHubProvider extends Provider {
  constructor() {
    super(config, "github");
  }

  /**
   * Creates an instance of the Arctic GitHub OAuth client.
   * 
   * @protected
   * @returns {arctic.GitHub} GitHub OAuth client instance.
   * @throws Will throw an error if clientId or clientSecret are missing.
   */
  protected createProviderInstance(): arctic.GitHub {
    const { clientId, clientSecret } = this.config;
    if (!clientId || !clientSecret) {
      throw new Error("GitHub requires GH_OAUTH_CLIENT_ID and GH_OAUTH_CLIENT_SECRET");
    }
    const redirectUri = `${process.env.API_GATEWAY_URL}/oauth/github/callback`;  
     
    return new arctic.GitHub(clientId, clientSecret, { redirectURI: redirectUri });
  }

  /**
   * Normalizes the raw GitHub user info into a standard format.
   * 
   * @param {any} userInfo - Raw user data from GitHub API.
   * @returns {NormalizedUserInfo} Normalized user object.
   * @throws Will throw an error if user ID is missing from the data.
   */
  public normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    const id = userInfo.id.toString();
    const name = userInfo.name || userInfo.login || null;
    const email = userInfo.email || null;
    const picture = userInfo.avatar_url || null;
    const fname = name?.split(" ")[0] || null;
    const lname = name?.split(" ")[1] || null;

    if (!id) throw new Error("Missing user ID from GitHub user info");

    return { id, name, email, picture, fname, lname };
  }
}
