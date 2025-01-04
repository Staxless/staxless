/**
 * @file MobileMenu Component
 * @module MobileMenu
 * @description A React component that renders a mobile-friendly dropdown menu for navigation and user actions.
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "../auth/sign-out-button";

/**
 * @interface MobileMenuProps
 * @description Props for the MobileMenu component
 * @property {Array<{name: string, href: string}>} navItems - Array of navigation items
 * @property {Object | null} user - User object containing username, or null if not logged in
 */
interface MobileMenuProps {
  navItems: Array<{ name: string; href: string }>;
  user: {
    username: string;
  } | null;
}

/**
 * @function MobileMenu
 * @description Renders a mobile-friendly dropdown menu with navigation items and user actions
 * @param {MobileMenuProps} props - The props for the MobileMenu component
 * @returns {JSX.Element} The MobileMenu component
 */
export default function MobileMenu({
  navItems,
  user,
}: MobileMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {navItems.map((item) => (
          <DropdownMenuItem key={item.name}>
            <Link href={item.href} className="w-full">
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
        {user ? (
          <>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{user.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>
            <Link href="/auth" className="w-full">
              Get Started
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
