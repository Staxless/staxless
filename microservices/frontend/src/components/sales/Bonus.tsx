'use client';

import { Gift, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, getTotalBonusValue, formatPrice } from '@config/sales-config';

export default function Bonus() {
  const colors = BRAND_CONFIG.brand.colors;
  const bonus = getSalesSection('bonus');
  const totalValue = getTotalBonusValue();

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5" style={{ color: colors.accent }} />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.accent }}
              >
                Free Bonuses
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {bonus.headline}
            </h2>
            <p
              className="text-lg"
              style={{ color: colors.textSecondary }}
            >
              {bonus.subheadline}
            </p>
          </div>

          {/* Bonuses */}
          <div className="space-y-6">
            {bonus.bonuses.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 rounded-xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.backgroundTertiary} 100%)`,
                  border: `2px solid ${colors.primary}30`,
                }}
              >
                {/* FREE Badge */}
                <div
                  className="absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase"
                  style={{
                    backgroundColor: colors.success,
                    color: colors.background,
                  }}
                >
                  FREE
                </div>

                {/* Bonus Image Placeholder */}
                <div
                  className="w-full md:w-48 h-32 md:h-auto rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Sparkles className="w-12 h-12" style={{ color: colors.primary }} />
                </div>

                {/* Bonus Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {item.name}
                    </h3>
                    {item.value && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: `${colors.warning}20`,
                          color: colors.warning,
                        }}
                      >
                        {item.value} Value
                      </span>
                    )}
                  </div>
                  <p
                    className="text-base"
                    style={{ color: colors.textSecondary }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Value */}
          {totalValue > 0 && (
            <div
              className="mt-8 p-6 rounded-xl text-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.accent}10 100%)`,
                border: `1px solid ${colors.primary}30`,
              }}
            >
              <p
                className="text-lg font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Total Bonus Value:
              </p>
              <p
                className="text-4xl font-bold"
                style={{ color: colors.primary }}
              >
                {formatPrice(totalValue)}
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: colors.textMuted }}
              >
                Included FREE with your enrollment
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
