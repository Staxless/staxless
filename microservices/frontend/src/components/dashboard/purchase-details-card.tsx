'use client';

import { Check, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BRAND_CONFIG } from '@config/brand-config';
import { SALES_CONFIG } from '@config/sales-config';

interface PurchaseDetailsCardProps {
  subscriptionStatus: string;
  startDate: string;
  email: string;
}

export default function PurchaseDetailsCard({
  subscriptionStatus,
  startDate,
  email,
}: PurchaseDetailsCardProps) {
  const colors = BRAND_CONFIG.brand.colors;
  const packages = SALES_CONFIG.purchasePitch.packages;
  const currentPackage = packages[0]; // Single plan

  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <Card
      className="border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <CreditCard
                className="h-5 w-5"
                style={{ color: colors.primary }}
              />
            </div>
            <CardTitle
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Purchase Details
            </CardTitle>
          </div>
          <Badge
            className="border-0"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
            }}
          >
            Staxless
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <p
              className="font-medium text-xs uppercase tracking-wide"
              style={{ color: colors.textMuted }}
            >
              Purchase Date
            </p>
            <p
              className="font-semibold text-sm"
              style={{ color: colors.textPrimary }}
            >
              {formattedDate}
            </p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <p
              className="font-medium text-xs uppercase tracking-wide"
              style={{ color: colors.textMuted }}
            >
              Status
            </p>
            <p
              className="font-semibold text-sm capitalize"
              style={{ color: colors.textPrimary }}
            >
              {subscriptionStatus}
            </p>
          </div>
        </div>

        <Separator style={{ backgroundColor: colors.border }} />

        {currentPackage && (
          <div>
            <h4
              className="mb-3 font-medium text-sm"
              style={{ color: colors.textPrimary }}
            >
              Included in your purchase
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {currentPackage.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0"
                    style={{ color: colors.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.textPrimary }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs" style={{ color: colors.textMuted }}>
          Your Stripe receipt was sent to {email}. Contact{' '}
          <a
            href={`mailto:${BRAND_CONFIG.company.email}?subject=Invoice Request`}
            className="underline"
            style={{ color: colors.primary }}
          >
            {BRAND_CONFIG.company.email}
          </a>{' '}
          if you need a formal invoice.
        </p>
      </CardContent>
    </Card>
  );
}
