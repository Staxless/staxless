/**
 * @file DiscordProvider.ts
 * @description Discord OAuth provider implementation extending the base Provider class.
 * Manages OAuth client creation, configuration, and normalization of Discord user info.
 */

import * as arctic from "arctic";
import { Provider, ProviderConfig, NormalizedUserInfo } from "./provider-types.js";
import { loadSecret } from "../../lib/secrets-manager.js";

const config: ProviderConfig = {
  clientId: loadSecret('DISCORD_CLIENT_ID') ?? process.env.DISCORD_CLIENT_ID ?? "",
  clientSecret: loadSecret('DISCORD_CLIENT_SECRET') ?? process.env.DISCORD_CLIENT_SECRET ?? "",
  userInfoUrl: "https://discord.com/api/users/@me",
  scopes: ["identify", "email"],
  usePKCE: false,
};

/**
 * Discord OAuth provider class.
 *
 * Extends the base Provider class to implement Discord-specific OAuth flow and user info normalization.
 *
 * @extends Provider
 */
export class DiscordProvider extends Provider {
  constructor() {
    super(config, "discord");
  }

  /**
   * Creates an instance of the Arctic Discord OAuth client.
   * 
   * @protected
   * @returns {arctic.Discord} Discord OAuth client instance.
   * @throws Will throw an error if clientId or clientSecret are missing.
   */
  protected createProviderInstance(): arctic.Discord {
    const { clientId, clientSecret } = this.config;
    if (!clientId || !clientSecret) {
      throw new Error("Discord requires DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET");
    }
    const redirectUri = `${process.env.API_GATEWAY_URL}oauth/discord/callback`;
     
    return new arctic.Discord(clientId, clientSecret, redirectUri);
  }

  /**
   * Normalizes the raw Discord user info into a standard format.
   * 
   * @param {any} userInfo - Raw user data from Discord API.
   * @returns {NormalizedUserInfo} Normalized user object.
   * @throws Will throw an error if user ID is missing from the data.
   */
  public normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    const id = userInfo.id;
    const name = userInfo.username || null;
    const email = userInfo.email || null;
    const picture = userInfo.avatar
      ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
      : null;
    const fname = name?.split(" ")[0] || null;
    const lname = name?.split(" ")[1] || null;

    if (!id) throw new Error("Missing user ID from Discord user info");

    return { id, name, email, picture, fname, lname };
  }
}
