'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface AccountSettingsProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    language: string;
  };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar
          className="flex h-16 w-16 items-center justify-center rounded-full text-xl"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <AvatarImage alt={user.name || 'User'} src={user.avatar} />
          <AvatarFallback
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
            }}
          >
            {(user.name || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2
            className="font-semibold text-xl"
            style={{ color: colors.textPrimary }}
          >
            {user.name}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {user.email}
          </p>
        </div>
        <Button
          className="ml-auto transition-colors"
          variant="outline"
          style={{
            borderColor: colors.border,
            color: colors.textPrimary,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Manage
        </Button>
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name" style={{ color: colors.textPrimary }}>
            Name
          </Label>
          <Input
            defaultValue={user.name}
            id="name"
            style={{
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" style={{ color: colors.textPrimary }}>
            Email
          </Label>
          <Input
            defaultValue={user.email}
            id="email"
            type="email"
            style={{
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language" style={{ color: colors.textPrimary }}>
            Language
          </Label>
          <Select defaultValue={user.language}>
            <SelectTrigger
              id="language"
              style={{
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            >
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <SelectItem value="en" style={{ color: colors.textPrimary }}>
                English
              </SelectItem>
              <SelectItem value="fr" style={{ color: colors.textPrimary }}>
                Français
              </SelectItem>
              <SelectItem value="de" style={{ color: colors.textPrimary }}>
                Deutsch
              </SelectItem>
              <SelectItem value="es" style={{ color: colors.textPrimary }}>
                Español
              </SelectItem>
              <SelectItem value="pt" style={{ color: colors.textPrimary }}>
                Português
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      <Button
        className="transition-colors"
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
        }}
      >
        Save Changes
      </Button>
    </div>
  );
}
