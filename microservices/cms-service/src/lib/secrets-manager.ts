import * as fs from 'fs';
import * as path from 'path';

const SECRETS_BASE_PATH = process.env.SECRETS_PATH ?? '/run/secrets';
const MAX_SECRET_SIZE = 1024 * 16; // 16 KB

// Cache to prevent multiple file reads
const secretCache = new Map<string, string>();

interface LoadSecretOptions {
  basePath?: string;
  required?: boolean;
}

/**
 * Load secret with caching and better error handling
 * Supports both _FILE env vars (Docker secrets) and regular env vars (local dev)
 * @returns string if found, undefined if not found (when not required)
 * @throws Error if required=true and secret not found
 */
export const loadSecret = (
  secretName: string,
  options: LoadSecretOptions = {}
): string | undefined => {
  const { basePath = SECRETS_BASE_PATH, required = false } = options;

  // Check cache first
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName);
  }

  // 1. Try _FILE env var pattern (Docker secrets at runtime)
  const filePathEnv = process.env[`${secretName}_FILE`];
  if (filePathEnv) {
    try {
      const secret = fs.readFileSync(filePathEnv, 'utf8').trim();
      if (secret) {
        secretCache.set(secretName, secret);
        console.info(`[loadSecret] Loaded ${secretName} from ${filePathEnv} (${secret.length} chars)`);
        return secret;
      }
    } catch (err: any) {
      console.warn(`[loadSecret] Failed to read from ${filePathEnv}:`, err.message);
    }
  }

  // 2. Try regular env var (local dev)
  if (process.env[secretName]) {
    const envValue = process.env[secretName];
    secretCache.set(secretName, envValue);
    console.info(`[loadSecret] Loaded ${secretName} from env var`);
    return envValue;
  }

  // 3. Try reading directly from secrets directory (fallback)
  const secretPath = path.join(basePath, secretName);
  try {
    const stats = fs.statSync(secretPath);
    
    if (!stats.isFile()) {
      throw new Error('Not a file');
    }
    if (stats.size === 0) {
      throw new Error('Empty file');
    }
    if (stats.size > MAX_SECRET_SIZE) {
      throw new Error(`File too large: ${stats.size} bytes`);
    }
    
    const mode = stats.mode & 0o777;
    if (mode !== 0o600 && mode !== 0o400) {
      console.warn(`[loadSecret] Insecure perms ${mode.toString(8)} on ${secretPath}`);
    }

    const buf = fs.readFileSync(secretPath);
    const secret = buf.toString('utf8').trim();
    buf.fill(0); // zero memory

    if (secret) {
      secretCache.set(secretName, secret);
      console.info(`[loadSecret] Loaded ${secretName} from ${secretPath} (${secret.length} chars)`);
      return secret;
    }
  } catch (err: any) {
    // Secret file doesn't exist or can't be read - this is expected during build
  }

  // 4. Return build-time placeholders
  if (secretName === 'DATABASE_URL') {
    console.info('[loadSecret] Using placeholder for DATABASE_URL (build time)');
    return 'mongodb://build:27017';
  }
  if (secretName === 'DATABASE_NAME') {
    console.info('[loadSecret] Using placeholder for DATABASE_NAME (build time)');
    return 'build';
  }
  if (secretName === 'PAYLOAD_SECRET') {
    console.info('[loadSecret] Using placeholder for PAYLOAD_SECRET (build time)');
    return 'build-placeholder-secret-min-32-chars-long';
  }

  // 5. Nothing found
  if (required) {
    throw new Error(`Required secret ${secretName} not found`);
  }
  
  return undefined;
};

/**
 * Clear the cache (useful for testing)
 */
export const clearSecretCache = (): void => {
  secretCache.clear();
};