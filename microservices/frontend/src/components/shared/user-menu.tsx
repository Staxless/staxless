'use client';
import { LucideUser, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignOutButton } from '../auth/sign-out-button';

interface User {
  name: string;
  email: string;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2" variant="ghost">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="flex items-center" href="/dashboard">
            <LucideUser className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="flex items-center" href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center text-red-600">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
