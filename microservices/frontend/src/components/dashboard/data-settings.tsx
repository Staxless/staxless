'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BRAND_CONFIG } from '@config/brand-config';

export function DataSettings() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg" style={{ color: colors.textPrimary }}>
          Data & Privacy
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Manage your data and privacy preferences.
        </p>
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics" style={{ color: colors.textPrimary }}>
              Usage Analytics
            </Label>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Allow us to collect anonymous usage data to improve our service.
            </p>
          </div>
          <Switch defaultChecked id="analytics" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing" style={{ color: colors.textPrimary }}>
              Marketing Communications
            </Label>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Receive emails about new features and updates.
            </p>
          </div>
          <Switch id="marketing" />
        </div>
      </div>

      <Separator style={{ backgroundColor: colors.border }} />

      <div className="space-y-4">
        <h3 className="font-medium text-lg" style={{ color: colors.textPrimary }}>
          Export Data
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Download a copy of your data or delete your account.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="transition-colors"
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
            Export Data
          </Button>
          <Button
            className="transition-colors"
            style={{
              backgroundColor: colors.error,
              color: colors.background,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
