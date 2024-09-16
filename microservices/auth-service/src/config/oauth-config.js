/*
  Description:
  This is the primary file for managing OAuth providers. It exports an
  object that maps provider names to their corresponding provider
  modules. Developers can add or remove providers from this central
  location as needed.

  Dependencies:
  - other providers as needed.
*/
import { GitHub } from "arctic";

/**
 * An object mapping provider names to their corresponding provider modules.
 *
 * @type {Object}
 * @property {Object} github - The GitHub OAuth provider module.
 * @property {Object} [otherProviders] - Additional OAuth provider modules
 *   can be added here.
 */
export const providers = {
  github: new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  ),

  // other providers can be added here
};

// Add user url to each
providers["github"].userInfoUrl = "https://api.github.com/user";
providers["github"].scopes = ["user:email"];
