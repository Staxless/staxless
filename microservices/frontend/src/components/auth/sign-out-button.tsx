/**
 * @file SignOutButton.tsx
 * @description Provides a button component for user sign out functionality
 * @module components/SignOutButton
 */
'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/signout-user';
import { useUser } from '@/contexts/user-context';
import { BRAND_CONFIG } from '@/lib/brand-config';

/**
 * @description SignOutButton component for handling user sign out
 * @returns The rendered sign out button
 */
export function SignOutButton() {
  const router = useRouter();
  const { clearUser } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const colors = BRAND_CONFIG.brand.colors;

  /**
   * @description Handles the sign out process
   * Clears user state immediately and redirects to home page
   * while the server-side logout happens in the background
   */
  const handleSignOut = async () => {
    setIsSigningOut(true);

    // Clear user state immediately for instant UI feedback
    clearUser();

    // Redirect to home page immediately
    router.push('/');

    // Perform server-side logout in the background
    // We don't wait for this - user already sees logged out state
    logout().catch(() => {
      // Logout error is non-critical since we already cleared local state
      // The session cookie will be invalidated on next server request anyway
    });

    // Force a hard navigation to ensure middleware runs
    // This clears any cached state and validates the session is gone
    router.refresh();
  };

  return (
    <Button
      className="w-full justify-start px-2 py-1.5 font-medium text-sm"
      disabled={isSigningOut}
      onClick={handleSignOut}
      variant="ghost"
      style={{ color: colors.error }}
    >
      {isSigningOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </>
      )}
    </Button>
  );
}
