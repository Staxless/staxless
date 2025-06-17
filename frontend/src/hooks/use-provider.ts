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
        console.log("Fetching providers from API...");
        const response = await fetch("/api/oauth/providers", {
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (responseText.trim() === "" || responseText.trim() === "undefined") {
          throw new Error("Empty or 'undefined' response from server");
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON Parse error:", parseError);
          throw new Error(`Invalid JSON response from server: ${responseText}`);
        }

        console.log("Parsed data:", data);

        if (!Array.isArray(data)) {
          throw new Error(`Unexpected data format. Expected array, got: ${typeof data}`);
        }

        if (mounted) {
          setProviders(data);
          sessionStorage.setItem("oauthProviders", JSON.stringify(data));
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching providers:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
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

