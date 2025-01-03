/**
 * @file app/hooks/useProviders.ts
 * @description Custom hook for fetching and caching OAuth providers
 */

"use client";

import { useState, useEffect } from "react";

interface Provider {
  name: string;
}

/**
 * Custom hook to fetch and manage OAuth providers
 * @returns {Object} An object containing providers, loading state, and error state
 */
export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProviders = async () => {
      try {
        const cachedProviders = sessionStorage.getItem("oauthProviders");
        if (cachedProviders && mounted) {
          setProviders(JSON.parse(cachedProviders));
          setIsLoading(false);
          return;
        }

        const response = await fetch("/auth/providers");
        const data = await response.json();

        if (mounted) {
          setProviders(data.providers);
          sessionStorage.setItem(
            "oauthProviders",
            JSON.stringify(data.providers),
          );
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching providers:", err);
          setError(
            "Failed to load authentication providers. Please try again later.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (typeof window !== "undefined") {
      fetchProviders();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { providers, isLoading, error };
}
