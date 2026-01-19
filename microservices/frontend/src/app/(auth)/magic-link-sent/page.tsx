'use client';

import { CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

function MagicLinkSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email address';

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
        </div>

        <Card
          className="border shadow-lg"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            borderColor: BRAND_CONFIG.brand.colors.border,
          }}
        >
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Mail
                className="h-16 w-16"
                style={{ color: BRAND_CONFIG.brand.colors.primary }}
              />
            </div>
            <CardTitle
              className="text-2xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Check your email
            </CardTitle>
            <CardDescription
              className="text-base"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              We sent a magic link to
            </CardDescription>
            <div
              className="mt-2 font-medium"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              {email}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Next Steps */}
            <div>
              <h3
                className="mb-3 font-semibold"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Next steps:
              </h3>
              <ol className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2
                    className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0"
                    style={{ color: BRAND_CONFIG.brand.colors.success }}
                  />
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                  >
                    Check your inbox for an email from {BRAND_CONFIG.company.name}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2
                    className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0"
                    style={{ color: BRAND_CONFIG.brand.colors.success }}
                  />
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                  >
                    Click the magic link in the email
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2
                    className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0"
                    style={{ color: BRAND_CONFIG.brand.colors.success }}
                  />
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                  >
                    You'll be automatically logged in
                  </span>
                </li>
              </ol>
            </div>

            {/* Troubleshooting Section */}
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <h4
                className="mb-2 font-semibold text-sm"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Didn't receive the email?
              </h4>
              <ul
                className="space-y-1 text-sm"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait a few minutes for the email to arrive</li>
                <li>
                  • Contact support at{' '}
                  <a
                    className="font-medium hover:underline"
                    href={`mailto:${BRAND_CONFIG.company.email}`}
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  >
                    {BRAND_CONFIG.company.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Back to Login Button */}
            <Link href="/login" className="block">
              <Button
                className="w-full"
                variant="outline"
                style={{
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
              >
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center">
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

export default function MagicLinkSentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MagicLinkSentContent />
    </Suspense>
  );
}
