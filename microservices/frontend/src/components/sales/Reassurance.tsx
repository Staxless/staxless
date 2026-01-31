'use client';

import { Shield, Check } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Reassurance() {
  const colors = BRAND_CONFIG.brand.colors;
  const reassurance = getSalesSection('reassurance');

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5" style={{ color: colors.success }} />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.success }}
              >
                Why It Works
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {reassurance.headline}
            </h2>
            <p
              className="text-lg"
              style={{ color: colors.textSecondary }}
            >
              {reassurance.subheadline}
            </p>
          </div>

          {/* Differentiators */}
          <div className="grid md:grid-cols-2 gap-6">
            {reassurance.differentiators.map((diff, index) => (
              <div
                key={index}
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.accent}20 100%)`,
                    }}
                  >
                    <Check className="w-5 h-5" style={{ color: colors.success }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {diff.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {diff.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
