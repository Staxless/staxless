/**
 * @file GitHubProvider.ts
 * @description GitHub OAuth provider implementation extending the base Provider class.
 * Manages OAuth client creation, configuration, and normalization of GitHub user info.
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "../providerTypes";

const config: ProviderConfig = {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
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
    console.log("GitHubProvider Config:", {
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret ? "[REDACTED]" : undefined,
      scopes: this.config.scopes,
      userInfoUrl: this.config.userInfoUrl,
      usePKCE: this.config.usePKCE,
      redirectUri: "http://localhost:8000/auth/github/callback",
    });
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
      throw new Error("GitHub requires GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET");
    }
    const redirectUri = "http://localhost:8000/auth/github/callback";
    console.log("GitHub Provider Instance Created with Redirect URI:", redirectUri, "Scopes:", this.config.scopes);
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
