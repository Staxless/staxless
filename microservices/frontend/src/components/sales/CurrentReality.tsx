'use client';

import { XCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function CurrentReality() {
  const colors = BRAND_CONFIG.brand.colors;
  const reality = getSalesSection('currentReality');

  return (
    <section className="py-20" style={{ backgroundColor: colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-6"
            style={{ color: colors.textPrimary }}
          >
            {reality.headline}
          </h2>

          {/* Intro Text */}
          <p
            className="text-lg text-center mb-12 italic"
            style={{ color: colors.textSecondary }}
          >
            {reality.introText}
          </p>

          {/* Pain Points */}
          <div className="space-y-4 mb-12">
            {reality.painPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg transition-all"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <XCircle
                  className="w-6 h-6 flex-shrink-0 mt-0.5"
                  style={{ color: colors.error }}
                />
                <p
                  className="text-base"
                  style={{ color: colors.textSecondary }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Empathy Statement */}
          <div
            className="p-6 rounded-xl text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
              border: `1px solid ${colors.primary}30`,
            }}
          >
            <p
              className="text-lg font-medium mb-4"
              style={{ color: colors.textPrimary }}
            >
              {reality.empathyStatement}
            </p>
            <p
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              {reality.transitionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
