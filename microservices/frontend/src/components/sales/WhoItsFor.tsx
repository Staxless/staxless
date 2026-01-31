'use client';

import { Check, X, Target } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function WhoItsFor() {
  const colors = BRAND_CONFIG.brand.colors;
  const whoItsFor = getSalesSection('whoItsFor');

  return (
    <section
      id="who-its-for"
      className="py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: colors.accent }} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.accent }}
            >
              Perfect Fit
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {whoItsFor.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {whoItsFor.subheadline}
          </p>
        </div>

        {/* Two Columns */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Right For */}
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `2px solid ${colors.success}30`,
            }}
          >
            <h3
              className="text-xl font-bold mb-6 flex items-center gap-2"
              style={{ color: colors.success }}
            >
              <Check className="w-6 h-6" />
              This Is For You If...
            </h3>
            <ul className="space-y-4">
              {whoItsFor.rightFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: colors.success }}
                  />
                  <span
                    className="text-base"
                    style={{ color: colors.textSecondary }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Right For */}
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: `${colors.error}10`,
              border: `2px solid ${colors.error}30`,
            }}
          >
            <h3
              className="text-xl font-bold mb-6 flex items-center gap-2"
              style={{ color: colors.error }}
            >
              <X className="w-6 h-6" />
              This Is NOT For You If...
            </h3>
            <ul className="space-y-4">
              {whoItsFor.notRightFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: colors.error }}
                  />
                  <span
                    className="text-base"
                    style={{ color: colors.textSecondary }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
