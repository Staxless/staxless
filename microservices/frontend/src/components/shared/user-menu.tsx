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
import { SettingsDialog } from './settings-dialog';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface User {
  name: string;
  email: string;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center space-x-2"
          variant="ghost"
          style={{ color: colors.textPrimary }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        }}
      >
        <div className="px-2 py-1.5">
          <p
            className="font-medium text-sm"
            style={{ color: colors.textPrimary }}
          >
            {user.name}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center"
            href="/dashboard"
            style={{ color: colors.textPrimary }}
          >
            <LucideUser className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <SettingsDialog>
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            style={{ color: colors.textPrimary }}
            onSelect={(e) => e.preventDefault()}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </SettingsDialog>
        <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
        <DropdownMenuItem
          className="flex items-center"
          style={{ color: colors.error }}
        >
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
