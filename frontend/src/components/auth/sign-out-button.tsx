/**
 * @file SignOutButton.tsx
 * @description Provides a button component for user sign out functionality
 * @module components/SignOutButton
 */

'use client';

import { useRouter } from 'next/navigation';
// External imports
import { useState } from 'react';

// Internal imports
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/signout-user';

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
      if (result.success) {
        router.push('/');
        router.refresh(); // Refresh the current route to update the UI
      } else {
        // Intentionally left blank: no action needed if sign out fails
      }
    } catch (_error) {
      // Intentionally left blank: error is handled elsewhere or not needed
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      className="w-full justify-start px-2 py-1.5 font-medium text-sm"
      disabled={isSigningOut}
      onClick={handleSignOut}
      variant="ghost"
    >
      {isSigningOut ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
