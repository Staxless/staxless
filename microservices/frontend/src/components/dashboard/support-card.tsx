'use client';

import { Calendar, Headphones, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

export default function SupportCard() {
  const colors = BRAND_CONFIG.brand.colors;
  const supportEmail = BRAND_CONFIG.company.email;

  return (
    <Card
      className="border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <Headphones
              className="h-5 w-5"
              style={{ color: colors.primary }}
            />
          </div>
          <div>
            <CardTitle
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Support
            </CardTitle>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Direct access to founder support
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${supportEmail}`} className="flex-1">
            <Button
              className="w-full transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Zach
            </Button>
          </a>
          <a
            href="https://calendly.com/zach-staxless/architecture-call"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full border transition-colors"
              variant="outline"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Architecture Call
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
