'use client';

import { Target } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Outcomes() {
  const colors = BRAND_CONFIG.brand.colors;
  const outcomes = getSalesSection('outcomes');

  // Support both old and new config structure
  const hasNewStructure = 'outcomes' in outcomes && Array.isArray(outcomes.outcomes);

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: colors.accent }} />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.accent }}
              >
                The Results
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {outcomes.headline}
            </h2>
          </div>

          {/* Numbered Outcomes */}
          {hasNewStructure ? (
            <div className="space-y-6">
              {outcomes.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 p-6 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* Number */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      color: '#FFFFFF',
                    }}
                  >
                    {outcome.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {outcome.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: colors.textSecondary }}
                    >
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Legacy support */
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {(outcomes as any).outcomeDetails?.map((detail: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.success}20` }}
                  >
                    <span style={{ color: colors.success }}>✓</span>
                  </div>
                  <p className="font-medium" style={{ color: colors.textPrimary }}>
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Closing Statement */}
          {outcomes.closingStatement && (
            <p
              className="text-lg text-center mt-12 font-medium"
              style={{ color: colors.textSecondary }}
            >
              {outcomes.closingStatement}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
