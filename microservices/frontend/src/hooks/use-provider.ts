/**
 * @file app/hooks/useProviders.ts
 * @description Custom hook for fetching and caching authentication providers (OAuth + Magic Link)
 */
'use client';

import { useEffect, useState } from 'react';

interface OAuthProvider {
  name: string;
  displayName: string;
  description: string;
}

interface MagicLinkProvider {
  enabled: boolean;
  displayName: string;
  description: string;
}

export interface AuthProviders {
  magicLink?: MagicLinkProvider;
  oauth: OAuthProvider[];
}

/**
 * Validates providers data format
 * @param data - Data to validate
 * @returns Validated providers object
 * @throws Error if data format is invalid
 */
function validateProvidersData(data: unknown): AuthProviders {
  if (typeof data !== 'object' || data === null) {
    throw new Error(
      `Unexpected data format. Expected object, got: ${typeof data}`
    );
  }

  const providers = data as Record<string, unknown>;

  if (!Array.isArray(providers.oauth)) {
    throw new Error('Invalid providers data: oauth must be an array');
  }

  return providers as unknown as AuthProviders;
}

/**
 * Parses response text to JSON
 * @param responseText - Raw response text
 * @returns Parsed JSON data
 * @throws Error if response is empty or invalid JSON
 */
function parseResponseText(responseText: string): unknown {
  if (responseText.trim() === '' || responseText.trim() === 'undefined') {
    throw new Error("Empty or 'undefined' response from server");
  }
  try {
    return JSON.parse(responseText);
  } catch (_parseError) {
    throw new Error(`Invalid JSON response from server: ${_parseError}`);
  }
}

/**
 * Saves providers to session storage
 * @param data - Providers data to save
 */
function saveProvidersToSession(data: AuthProviders): void {
  try {
    sessionStorage.setItem('authProviders', JSON.stringify(data));
  } catch (_error) {
    throw new Error(`Failed to save providers to session storage: ${_error}`);
  }
}

/**
 * Handles errors by setting error state
 * @param err - Error to handle
 * @param setError - State setter for error
 */
function handleError(
  err: unknown,
  setError: (error: string | null) => void
): void {
  setError(err instanceof Error ? err.message : String(err));
}

/**
 * Loads providers from session storage
 * @returns Providers data or null if not found/invalid
 */
function loadFromSessionStorage(): AuthProviders | null {
  try {
    const cachedProviders = sessionStorage.getItem('authProviders');
    if (cachedProviders) {
      const parsedData = parseResponseText(cachedProviders);
      return validateProvidersData(parsedData);
    }
  } catch (_err) {
    sessionStorage.removeItem('authProviders');
    throw new Error(`Failed to load providers from session storage: ${_err}`);
  }
  return null;
}

/**
 * Fetches providers from API
 * @param abortSignal - Abort signal for fetch
 * @returns Providers data
 * @throws Error on fetch failure
 */
async function fetchFromApi(abortSignal: AbortSignal): Promise<AuthProviders> {
  const response = await fetch('/api/auth/providers', {
    headers: { Accept: 'application/json' },
    signal: abortSignal,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const responseText = await response.text();
  const data = parseResponseText(responseText);
  return validateProvidersData(data);
}

/**
 * Custom hook to fetch and manage authentication providers (OAuth + Magic Link).
 * It first attempts to load providers from session storage for performance.
 * If not found, it fetches them from the API.
 * @returns {Object} An object containing providers, loading state, and error state
 */
export function useProviders() {
  const [providers, setProviders] = useState<AuthProviders>({ oauth: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadProviders() {
      // Try loading from session storage
      const cachedProviders = loadFromSessionStorage();
      if (cachedProviders) {
        setProviders(cachedProviders);
        setIsLoading(false);
        return;
      }

      // Fetch from API if cache is unavailable
      try {
        const providersData = await fetchFromApi(abortController.signal);
        setProviders(providersData);
        saveProvidersToSession(providersData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        handleError(err, setError);
      } finally {
        setIsLoading(false);
      }
    }

    loadProviders();

    return () => {
      abortController.abort();
    };
  }, []);

  return { providers, isLoading, error };
}
