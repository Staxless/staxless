'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  subscription: {
    type: string;
    startDate: Date;
    status: string;
  };
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Cache configuration
const CACHE_TTL_MS = 30000; // 30 seconds - don't re-validate within this window
const DEBOUNCE_MS = 100; // Debounce rapid calls

interface UserProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // Cache tracking refs (don't trigger re-renders)
  const lastFetchTime = useRef<number>(0);
  const isFetching = useRef<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Clear user immediately (for logout)
  const clearUser = useCallback(() => {
    setUser(null);
    lastFetchTime.current = 0; // Reset cache so next refresh will fetch
  }, []);

  // Refresh user with caching and debouncing
  const refreshUser = useCallback(async () => {
    const now = Date.now();

    // Skip if already fetching
    if (isFetching.current) {
      return;
    }

    // Skip if cache is still valid
    if (lastFetchTime.current && now - lastFetchTime.current < CACHE_TTL_MS) {
      return;
    }

    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the actual fetch
    return new Promise<void>((resolve) => {
      debounceTimer.current = setTimeout(async () => {
        // Double-check we're not already fetching after debounce
        if (isFetching.current) {
          resolve();
          return;
        }

        isFetching.current = true;
        setIsLoading(true);

        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          });

          lastFetchTime.current = Date.now();

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch {
          // Keep current user state on error, but mark cache as stale
          lastFetchTime.current = 0;
        } finally {
          isFetching.current = false;
          setIsLoading(false);
          resolve();
        }
      }, DEBOUNCE_MS);
    });
  }, []);

  // Re-validate user on mount, but only if we have an initial user
  // and the cache is stale
  useEffect(() => {
    // If we have initial user from SSR, trust it initially
    // and mark cache as fresh to avoid immediate re-fetch
    if (initialUser) {
      lastFetchTime.current = Date.now();
    }

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []); // Only run on mount

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
