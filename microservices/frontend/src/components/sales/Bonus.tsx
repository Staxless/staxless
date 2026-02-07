'use client';

import { Sparkles, Terminal, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Bonus() {
  const colors = BRAND_CONFIG.brand.colors;
  const bonus = getSalesSection('bonus');

  // Check if using new structure (candy feature) or old structure (bonuses array)
  const hasCandyFeature = bonus.codeExample || bonus.bonusDescription;
  const hasLegacyBonuses = bonus.bonuses && bonus.bonuses.length > 0;

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: colors.background }}>
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
                The "Whoa" Feature
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {bonus.headline}
            </h2>
            <p
              className="text-xl font-semibold"
              style={{ color: colors.secondary }}
            >
              {bonus.subheadline}
            </p>
          </div>

          {/* Candy Feature Showcase */}
          {hasCandyFeature ? (
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.background} 100%)`,
                border: `2px solid ${colors.primary}30`,
              }}
            >
              {/* Decorative gradient */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: colors.accent }}
              />

              <div className="relative z-10">
                {/* Code Example */}
                {bonus.codeExample && (
                  <div
                    className="mb-8 p-4 rounded-xl font-mono text-lg"
                    style={{
                      backgroundColor: '#0F172A',
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5" style={{ color: colors.accent }} />
                      <span style={{ color: '#94A3B8' }}>$</span>
                      <span style={{ color: colors.accent }}>staxless</span>
                      <span style={{ color: '#F8FAFC' }}>generate service</span>
                      <span style={{ color: colors.secondary }}>notifications</span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p style={{ color: '#10B981' }}>✓ Created microservices/notifications-service/</p>
                      <p style={{ color: '#10B981' }}>✓ Kafka consumer configured</p>
                      <p style={{ color: '#10B981' }}>✓ Ready to build!</p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {bonus.bonusDescription && (
                  <div className="text-center">
                    <p
                      className="text-lg leading-relaxed mb-6"
                      style={{ color: colors.textSecondary }}
                    >
                      {bonus.bonusDescription}
                    </p>
                    <div
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
                        border: `1px solid ${colors.primary}30`,
                      }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: colors.primary }} />
                      <span className="font-medium" style={{ color: colors.primary }}>
                        One command. New microservice. Kafka wired. Ready to build.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Legacy: Bonuses Array */
            hasLegacyBonuses && bonus.bonuses && (
              <div className="space-y-6">
                {bonus.bonuses.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-6 p-6 rounded-xl relative overflow-hidden"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase"
                      style={{ backgroundColor: colors.success, color: '#FFFFFF' }}
                    >
                      FREE
                    </div>
                    <div
                      className="w-full md:w-48 h-32 md:h-auto rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
                      }}
                    >
                      <Sparkles className="w-12 h-12" style={{ color: colors.primary }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                          {item.name}
                        </h3>
                        {item.value && (
                          <span
                            className="px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ backgroundColor: `${colors.warning}20`, color: colors.warning }}
                          >
                            {item.value} Value
                          </span>
                        )}
                      </div>
                      <p className="text-base" style={{ color: colors.textSecondary }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
