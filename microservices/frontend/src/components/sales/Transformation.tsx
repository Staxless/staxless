'use client';

import { Check, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Transformation() {
  const colors = BRAND_CONFIG.brand.colors;
  const transformation = getSalesSection('transformation');

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.accent }}
              >
                The Transformation
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {transformation.headline}
            </h2>
            <p
              className="text-xl"
              style={{ color: colors.textSecondary }}
            >
              {transformation.visionStatement}
            </p>
          </div>

          {/* Champagne Moments */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                Imagine...
              </h3>
              {transformation.champagneMoments.map((moment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    backgroundColor: `${colors.success}10`,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <Check
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: colors.success }}
                  />
                  <p style={{ color: colors.textPrimary }}>{moment}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                All of this...
              </h3>
              {transformation.withoutPainPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Check
                      className="w-3 h-3"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <p style={{ color: colors.textSecondary }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Statement */}
          <div
            className="text-center p-8 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <p
              className="text-xl font-semibold"
              style={{ color: colors.background }}
            >
              {transformation.closingStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
