'use client';

import { Check, X } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function WhyDifferent() {
  const colors = BRAND_CONFIG.brand.colors;
  const whyDifferent = getSalesSection('whyDifferent');

  return (
    <section
      id="why-different"
      className="py-20"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {whyDifferent.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {whyDifferent.subheadline}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Table Header */}
            <div
              className="grid grid-cols-3 gap-4 p-4"
              style={{
                background: `linear-gradient(135deg, ${colors.backgroundTertiary} 0%, ${colors.backgroundSecondary} 100%)`,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="font-semibold"
                style={{ color: colors.textMuted }}
              >
                Aspect
              </div>
              <div
                className="font-semibold text-center"
                style={{ color: colors.error }}
              >
                Other Solutions
              </div>
              <div
                className="font-semibold text-center"
                style={{ color: colors.success }}
              >
                Our Approach
              </div>
            </div>

            {/* Table Rows */}
            {whyDifferent.comparisons.map((comparison, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 p-4"
                style={{
                  borderBottom:
                    index < whyDifferent.comparisons.length - 1
                      ? `1px solid ${colors.border}`
                      : 'none',
                }}
              >
                {/* Aspect */}
                <div
                  className="font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {comparison.aspect}
                </div>

                {/* Other Solutions */}
                <div className="flex items-start gap-2">
                  <X
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: colors.error }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    {comparison.otherSolutions}
                  </span>
                </div>

                {/* Your Solution */}
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: colors.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {comparison.yourSolution}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <p
            className="text-center text-lg font-medium mt-8"
            style={{ color: colors.textPrimary }}
          >
            {whyDifferent.closingStatement}
          </p>
        </div>
      </div>
    </section>
  );
}
