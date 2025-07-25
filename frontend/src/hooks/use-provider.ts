/**
 * @file app/hooks/useProviders.ts
 * @description Custom hook for fetching and caching OAuth providers
 */
'use client';

import { useEffect, useState } from 'react';

interface Provider {
  name: string;
}

/**
 * Validates providers data format
 * @param data - Data to validate
 * @returns Validated providers array
 * @throws Error if data is not an array
 */
function validateProvidersData(data: unknown): Provider[] {
  if (!Array.isArray(data)) {
    throw new Error(
      `Unexpected data format. Expected array, got: ${typeof data}`
    );
  }
  return data as Provider[];
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
    throw new Error(`Invalid JSON response from server: ${responseText}`);
  }
}

/**
 * Saves providers to session storage
 * @param data - Providers data to save
 */
function saveProvidersToSession(data: Provider[]): void {
  try {
    sessionStorage.setItem('oauthProviders', JSON.stringify(data));
  } catch (_error) {
    // Intentional no-op: silently ignore session storage failures
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
function loadFromSessionStorage(): Provider[] | null {
  try {
    const cachedProviders = sessionStorage.getItem('oauthProviders');
    if (cachedProviders) {
      const parsedData = parseResponseText(cachedProviders);
      return validateProvidersData(parsedData);
    }
  } catch (_err) {
    sessionStorage.removeItem('oauthProviders');
  }
  return null;
}

/**
 * Fetches providers from API
 * @param abortSignal - Abort signal for fetch
 * @returns Providers data
 * @throws Error on fetch failure
 */
async function fetchFromApi(abortSignal: AbortSignal): Promise<Provider[]> {
  const response = await fetch('/api/oauth/providers', {
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
 * Custom hook to fetch and manage OAuth providers.
 * It first attempts to load providers from session storage for performance.
 * If not found, it fetches them from the API.
 * @returns {Object} An object containing providers, loading state, and error state
 */
export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
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
