'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function Hero() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-4 pt-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container relative z-10 mx-auto max-w-5xl py-12 text-center">
        <h1
          className="mb-8 font-medium text-4xl leading-tight md:text-6xl"
          style={{ color: colors.textPrimary }}
        >
          <span>{BRAND_CONFIG.content.hero.title} </span>
          <span style={{ color: colors.primary }}>
            {BRAND_CONFIG.content.hero.titleHighlight}
          </span>
          <br />
          <span>{BRAND_CONFIG.content.hero.titleEnd}</span>
        </h1>

        <p
          className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl"
          style={{ color: colors.textSecondary }}
        >
          {BRAND_CONFIG.content.hero.subtitle}
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="/register">
            <Button
              className="min-w-[200px] rounded-lg px-8 py-4 font-medium text-lg transition-colors"
              size="lg"
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
              {BRAND_CONFIG.content.hero.primaryCTA}
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              className="min-w-[200px] rounded-lg px-8 py-4 text-lg transition-colors"
              size="lg"
              variant="outline"
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
              {BRAND_CONFIG.content.hero.secondaryCTA}
            </Button>
          </Link>
        </div>

        {/* App mockup placeholder */}
        <div className="mt-20">
          <div
            className="mx-auto max-w-4xl rounded-lg border p-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
            }}
          >
            <div
              className="flex aspect-video items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <span
                    className="font-bold text-2xl"
                    style={{ color: colors.background }}
                  >
                    {BRAND_CONFIG.company.name.charAt(0)}
                  </span>
                </div>
                <p style={{ color: colors.textMuted }}>
                  Your SaaS dashboard preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
