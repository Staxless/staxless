'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const colors = BRAND_CONFIG.brand.colors;

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1
            className="mb-2 font-bold text-9xl"
            style={{ color: colors.textMuted }}
          >
            500
          </h1>

          <p
            className="mb-8 text-lg"
            style={{ color: colors.textSecondary }}
          >
            Something went wrong.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div
              className="mx-auto mb-8 max-w-md rounded-lg border p-4 text-left"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <p
                className="font-mono text-sm"
                style={{ color: colors.error }}
              >
                {error.message}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={reset}
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
              Try Again
            </Button>

            <Button
              asChild
              variant="outline"
              className="transition-colors"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
