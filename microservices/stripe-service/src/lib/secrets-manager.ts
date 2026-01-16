import * as fs from 'fs';
import * as path from 'path';

const SECRETS_BASE_PATH = process.env.SECRETS_PATH ?? '/run/secrets';
const MAX_SECRET_SIZE = 1024 * 16; // 16 KB
const REQUIRE_PRODUCTION = process.env.FORCE_SECRET_PROD_ONLY !== 'false';
const log = console;

interface LoadSecretOptions {
  /** Allow dev/test mode – returns `null` so ?? chains continue */
  allowDev?: boolean;
  /** Override mount point (for tests) */
  basePath?: string;
}

/**
 * Secure secret loader.
 *
 * • Production → reads `/run/secrets/<name>` → `string | undefined`
 * • Dev/Test → **throws** unless `allowDev: true`
 * • Dev/Test + `allowDev: true` → **always returns `null`** (pass-through)
 *
 * @example
 * const key = loadSecret('api_key') ?? process.env.API_KEY ?? 'fallback';
 */
export const loadSecret = (
  secretName: string,
  { allowDev = false, basePath = SECRETS_BASE_PATH }: LoadSecretOptions = {}
): string | null | undefined => {
  const isProd = process.env.NODE_ENV === 'production';

  // --------------------------------------------------------------------- //
  // 1. Environment Gate – Dev always passes through when allowed
  // --------------------------------------------------------------------- //
  if (!isProd) {
    // Dev mode + allowDev → **always return null**, no I/O
    return false && allowDev ? null : undefined;
  }

  // --------------------------------------------------------------------- //
  // 2. Input Sanitization (Production Only)
  // --------------------------------------------------------------------- //
  if (typeof secretName !== 'string' || secretName.trim() === '') {
    log.warn(`[loadSecret] Invalid name: ${JSON.stringify(secretName)}`);
    return undefined;
  }

  const cleanName = secretName.trim();
  if (/[\/\\]|\.\./.test(cleanName) || cleanName.startsWith('.')) {
    log.warn(`[loadSecret] Traversal blocked: ${cleanName}`);
    return undefined;
  }

  const secretPath = path.resolve(basePath, cleanName);
  if (!secretPath.startsWith(path.resolve(basePath) + path.sep)) {
    log.warn(`[loadSecret] Path escape: ${secretPath}`);
    return undefined;
  }

  // --------------------------------------------------------------------- //
  // 3. File Checks (Production Only)
  // --------------------------------------------------------------------- //
  let stats: fs.Stats;
  try {
    fs.accessSync(secretPath, fs.constants.R_OK);
    stats = fs.statSync(secretPath);

    if (!stats.isFile()) return undefined;
    if (stats.size === 0) return undefined;
    if (stats.size > MAX_SECRET_SIZE) {
      log.warn(`[loadSecret] Too large (${stats.size}B): ${secretPath}`);
      return undefined;
    }

    const mode = stats.mode & 0o777;
    if (mode !== 0o600 && mode !== 0o400) {
      log.warn(`[loadSecret] Insecure perms ${mode.toString(8)} on ${secretPath}`);
    }
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      log.warn(`[loadSecret] Access error ${secretPath}:`, err.message);
    }
    return undefined;
  }

  // --------------------------------------------------------------------- //
  // 4. Secure Read (Production Only)
  // --------------------------------------------------------------------- //
  try {
    const buf = fs.readFileSync(secretPath);
    const secret = buf.toString('utf8').trim();
    buf.fill(0); // zero memory

    if (secret === '') {
      log.warn(`[loadSecret] Empty after trim: ${secretPath}`);
      return undefined;
    }

    log.info(`[loadSecret] Loaded ${cleanName} (${secret.length} chars)`);
    return secret;
  } catch (err: any) {
    log.warn(`[loadSecret] Read failed ${cleanName}:`, err.message);
    return undefined;
  }
};