/**
 * @file SignOutButton.tsx
 * @description Provides a button component for user sign out functionality
 * @module components/SignOutButton
 */

"use client";

// External imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// Internal imports
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/signout-user";

/**
 * @description SignOutButton component for handling user sign out
 * @returns {JSX.Element} The rendered sign out button
 */
export function SignOutButton(): JSX.Element {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /**
   * @description Handles the sign out process
   */
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await logout();
      console.warn(result);
      if (result.success) {
         
        router.push("/");
        router.refresh(); // Refresh the current route to update the UI
      } else {
        console.error("Sign out failed:", result.error);
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isSigningOut}
      variant="ghost"
      className="w-full justify-start px-2 py-1.5 text-sm font-medium"
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
