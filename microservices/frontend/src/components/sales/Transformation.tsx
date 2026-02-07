'use client';

import { Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function Transformation() {
  const colors = BRAND_CONFIG.brand.colors;
  const transformation = getSalesSection('transformation');

  // Support both old and new config structure
  const hasBeforeAfter = 'beforePoints' in transformation && 'afterPoints' in transformation;

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
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

          {/* Before/After Comparison */}
          {hasBeforeAfter ? (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Before Column */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-6 flex items-center gap-2"
                  style={{ color: colors.textMuted }}
                >
                  <X className="w-5 h-5" style={{ color: colors.error }} />
                  Where You Are Now
                </h3>
                <div className="space-y-3">
                  {transformation.beforePoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{
                        backgroundColor: `${colors.error}08`,
                      }}
                    >
                      <X
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: colors.error }}
                      />
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Column */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-6 flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Check className="w-5 h-5" style={{ color: colors.success }} />
                  Where You Could Be
                </h3>
                <div className="space-y-3">
                  {transformation.afterPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{
                        backgroundColor: `${colors.success}08`,
                      }}
                    >
                      <Check
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: colors.success }}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Legacy support for old structure */
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Imagine...
                </h3>
                {(transformation as any).champagneMoments?.map((moment: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.success}10` }}
                  >
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.success }} />
                    <p style={{ color: colors.textPrimary }}>{moment}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  All of this...
                </h3>
                {(transformation as any).withoutPainPoints?.map((point: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: colors.backgroundSecondary }}
                  >
                    <Check className="w-3 h-3" style={{ color: colors.primary }} />
                    <p style={{ color: colors.textSecondary }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closing Statement */}
          <div
            className="text-center p-8 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <p
              className="text-lg md:text-xl font-medium leading-relaxed"
              style={{ color: '#FFFFFF' }}
            >
              {transformation.closingStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
