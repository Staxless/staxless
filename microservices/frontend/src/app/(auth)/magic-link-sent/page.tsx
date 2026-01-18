import { Mail, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

export const metadata: Metadata = {
  title: 'Magic Link Sent',
};

export default function MagicLinkSentPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="mb-8 text-center">
          <Link
            className="mb-4 flex items-center justify-center space-x-2"
            href="/"
          >
            <Logo size="large" />
            <span
              className="font-bold text-2xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              {BRAND_CONFIG.company.name}
            </span>
          </Link>
          <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            Check your email for the magic link
          </p>
        </div>

        <Card
          className="border shadow-lg"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            borderColor: BRAND_CONFIG.brand.colors.border,
          }}
        >
          <CardHeader className="text-center">
            <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Magic Link Sent
            </CardTitle>
            <CardDescription
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              We&apos;ve sent a magic link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <Sparkles
                  className="h-12 w-12"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
              <p style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                A magic link has been sent to your email. Click the link to sign
                in to your account.
              </p>
              <div className="flex justify-center">
                <Mail
                  className="h-8 w-8"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
              </div>
              <p
                className="text-sm"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <Link
                  className="font-medium hover:underline"
                  href="/login"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                >
                  try again
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 space-y-2 text-center">
          <Link
            className="text-sm hover:underline"
            href="/"
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
