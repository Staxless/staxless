/**
 * @file UserMenu Component
 * @module UserMenu
 * @description A React component that renders a dropdown menu for authenticated users.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "./auth/SignOutButton";

/**
 * @interface UserMenuProps
 * @description Props for the UserMenu component
 * @property {Object} user - User object containing user information
 * @property {string} user.username - The username of the user
 * @property {string} user.name - The full name of the user
 * @property {string} [user.avatar] - The URL of the user's avatar image (optional)
 */
interface UserMenuProps {
  user: {
    username: string;
    name: string;
    avatar?: string;
  };
}

/**
 * @function UserMenu
 * @description Renders a dropdown menu for authenticated users with avatar and user actions
 * @param {UserMenuProps} props - The props for the UserMenu component
 * @returns {JSX.Element} The UserMenu component
 */
export default function UserMenu({ user }: UserMenuProps): JSX.Element {
  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name || "User"} />
            <AvatarFallback>
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <Link href="/dashboard">{user.name || "User"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
