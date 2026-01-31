'use client';

import { Zap, Check } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Solution() {
  const colors = BRAND_CONFIG.brand.colors;
  const solution = getSalesSection('solution');

  return (
    <section
      id="solution"
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%)`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Intro Label */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5" style={{ color: colors.accent }} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.accent }}
            >
              {solution.offerIntro}
            </span>
          </div>

          {/* Offer Name */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {solution.offerName}
          </h2>

          {/* Tagline */}
          <p
            className="text-xl md:text-2xl mb-12"
            style={{ color: colors.textSecondary }}
          >
            {solution.tagline}
          </p>

          {/* Product Image Placeholder */}
          <div
            className="relative w-full max-w-2xl mx-auto mb-12 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.backgroundTertiary,
              border: `2px solid ${colors.border}`,
              aspectRatio: '16/9',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-center p-8"
                style={{ color: colors.textMuted }}
              >
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Product Preview</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div
              className="absolute top-4 left-4 w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.error }}
            />
            <div
              className="absolute top-4 left-10 w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.warning }}
            />
            <div
              className="absolute top-4 left-16 w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.success }}
            />
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            {solution.keyBenefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-xl text-left transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
                  }}
                >
                  <Check className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <p
                  className="font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
