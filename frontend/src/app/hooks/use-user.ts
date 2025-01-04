/**
 * @file app/hooks/useUser.ts
 * @description Custom hook for fetching and managing user data
 */

"use client";

import { useState, useEffect } from "react";

interface User {
  // Define user properties here
  // For example:
  // id: string;
  // name: string;
  // email: string;
  [key: string]: any;
}

/**
 * Custom hook to fetch and manage user data
 * @returns {User | null} The user object if fetched successfully, otherwise null
 */
export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUser();
  }, []);

  return user;
}
