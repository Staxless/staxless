'use client';

import { Target, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Outcomes() {
  const colors = BRAND_CONFIG.brand.colors;
  const outcomes = getSalesSection('outcomes');

  return (
    <section className="py-20" style={{ backgroundColor: colors.backgroundSecondary }}>
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
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {outcomes.headline}
            </h2>
            <p
              className="text-xl"
              style={{ color: colors.textSecondary }}
            >
              {outcomes.resultStatement}
            </p>
          </div>

          {/* Outcome Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {outcomes.outcomeDetails.map((detail, index) => (
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
                  <ArrowRight className="w-4 h-4" style={{ color: colors.success }} />
                </div>
                <p
                  className="font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {detail}
                </p>
              </div>
            ))}
          </div>

          {/* Imagination Prompts */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundTertiary} 100%)`,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="text-xl font-semibold mb-6 text-center"
              style={{ color: colors.textPrimary }}
            >
              Imagine...
            </h3>
            <div className="space-y-4">
              {outcomes.imaginationPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}10` }}
                >
                  <span
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {prompt.champagneMoment}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    {prompt.withoutPainPoint}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Statement */}
          <p
            className="text-lg text-center mt-8 font-medium"
            style={{ color: colors.textSecondary }}
          >
            {outcomes.closingStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
