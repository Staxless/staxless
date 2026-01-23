'use client';

import Link from 'next/link';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function NotFound() {
  const colors = BRAND_CONFIG.brand.colors;

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
            404
          </h1>

          <p
            className="mb-8 text-lg"
            style={{ color: colors.textSecondary }}
          >
            This page could not be found.
          </p>

          <Button
            asChild
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
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
