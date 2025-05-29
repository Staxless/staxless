/**
npm run generate-provider
# Enter: twitch, true, https://api.twitch.tv/helix/users, false
# Creates: src/config/providers/twitch.ts
# Updates: src/config/oauth-config.ts
*/
import fs from "fs/promises";
import path from "path";
import prompts from "prompts";

/**
* Generates a new OAuth provider subclass.
*
* @async
* @throws {Error} If file operations fail.
*/
async function generateProvider() {
  /**
   * Prompt for provider details.
   *
   * @returns {Promise<{providerName: string, usePKCE: boolean, userInfoUrl: string, hasCustomLogic: boolean}>}
   */
  const { providerName, usePKCE, userInfoUrl, hasCustomLogic } = await prompts([
    { type: "text", name: "providerName", message: "Provider name (e.g., twitch):" },
    { type: "confirm", name: "usePKCE", message: "Does the provider require PKCE?" },
    { type: "text", name: "userInfoUrl", message: "User info endpoint URL:" },
    { type: "confirm", name: "hasCustomLogic", message: "Does the provider require custom instantiation logic (e.g., Apple’s JWT)?" },
  ]);

  /**
   * Path to the provider template file.
   * @type {string}
   */
  const templatePath = path.join(__dirname, "../src/config/providers/template.ts");

  /**
   * Path for the new provider file to be created.
   * @type {string}
   */
  const newProviderPath = path.join(__dirname, "../src/config/providers", `${providerName}.ts`);

  /**
   * Template content read from the provider template file.
   * @type {string}
   */
  let template = await fs.readFile(templatePath, "utf-8");

  template = template
    .replace(/TemplateProvider/g, `${providerName.charAt(0).toUpperCase() + providerName.slice(1)}Provider`)
    .replace(/template/g, providerName.toLowerCase())
    .replace(/TEMPLATE/g, providerName.toUpperCase())
    .replace(/https:\/\/api\.example\.com\/user/, userInfoUrl)
    .replace(/usePKCE: false/, `usePKCE: ${usePKCE}`);

  if (hasCustomLogic) {
    template = template.replace(
      /protected createProviderInstance.*?\n\s*}/s,
      `protected createProviderInstance(): arctic.OAuth2Client {
  const { clientId, clientSecret, redirectUri } = this.config;
  // TODO: Add custom instantiation logic here (e.g., JWT for Apple, custom endpoints for Auth0)
  return new arctic.OAuth2Client(clientId, clientSecret, redirectUri);
}`
    );
  }

  await fs.writeFile(newProviderPath, template);
  console.log(`Created provider file: src/config/providers/${providerName}.ts`);

  /**
   * Path to the OAuth configuration file to be updated.
   * @type {string}
   */
  const oauthConfigPath = path.join(__dirname, "../src/config/oauth-config.ts");

  /**
   * Content of the OAuth configuration file.
   * @type {string}
   */
  let oauthConfig = await fs.readFile(oauthConfigPath, "utf-8");

  /**
   * Import statement for the new provider.
   * @type {string}
   */
  const importStatement = `import { ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}Provider } from "./providers/${providerName}";\n`;

  /**
   * Provider entry to add to the providers object.
   * @type {string}
   */
  const providerEntry = `  ${providerName}: new ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}Provider(),\n`;

  /**
   * Index where the import statement will be inserted.
   * @type {number}
   */
  const importIndex = oauthConfig.indexOf("import { Provider } from");

  oauthConfig = oauthConfig.slice(0, importIndex) + importStatement + oauthConfig.slice(importIndex);

  /**
   * Index where the provider entry will be inserted in the providers object.
   * @type {number}
   */
  const providersIndex = oauthConfig.indexOf("export const providers: Providers = {") + "export const providers: Providers = {".length;

  oauthConfig = oauthConfig.slice(0, providersIndex) + "\n" + providerEntry + oauthConfig.slice(providersIndex);

  await fs.writeFile(oauthConfigPath, oauthConfig);
  console.log(`Updated oauth-config.ts with ${providerName} provider`);
}

/**
 * Executes the provider generation and handles errors.
 * @remarks Logs any errors to the console.
 */
generateProvider().catch((error) => console.error(`Error: ${error}`));