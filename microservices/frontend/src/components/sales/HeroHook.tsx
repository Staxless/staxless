'use client';

import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function HeroHook() {
  const colors = BRAND_CONFIG.brand.colors;
  const hero = getSalesSection('hero');

  return (
    <section
      className="relative min-h-[90vh] flex items-center"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at top, ${colors.primary}20 0%, transparent 50%)`,
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span style={{ color: colors.textPrimary }}>{hero.headline} </span>
            {hero.headlineHighlight && (
              <span
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {hero.headlineHighlight}
              </span>
            )}
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            {hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={hero.ctaUrl}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {hero.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {hero.secondaryCtaText && hero.secondaryCtaUrl && (
              <Link href={hero.secondaryCtaUrl}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 font-semibold transition-all"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {hero.secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      backgroundColor: colors.backgroundTertiary,
                      borderColor: colors.background,
                    }}
                  />
                ))}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: colors.textMuted }}
              >
                500+ members
              </span>
            </div>
            <div
              className="h-4 w-px"
              style={{ backgroundColor: colors.border }}
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-4 h-4"
                  fill={colors.warning}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span
                className="text-sm font-medium ml-1"
                style={{ color: colors.textMuted }}
              >
                4.9/5 rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2"
          style={{ borderColor: colors.textMuted }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: colors.textMuted }}
          />
        </div>
      </div>
    </section>
  );
}
