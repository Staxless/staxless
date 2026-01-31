'use client';

import { Eye, UserPlus, Unlock, Rocket, Zap, Star, Shield } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type HowItWorksStep } from '@config/sales-config';

const stepIcons: Record<string, React.ElementType> = {
  UserPlus,
  Unlock,
  Rocket,
  Zap,
  Star,
  Shield,
};

function StepCard({ step }: { step: HowItWorksStep }) {
  const colors = BRAND_CONFIG.brand.colors;
  const Icon = step.icon ? stepIcons[step.icon] || Zap : Zap;

  return (
    <div className="text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <Icon className="w-8 h-8" style={{ color: colors.background }} />
        <div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
          }}
        >
          {step.step}
        </div>
      </div>
      <h4
        className="text-lg font-semibold mb-2"
        style={{ color: colors.textPrimary }}
      >
        {step.title}
      </h4>
      <p
        className="text-sm"
        style={{ color: colors.textSecondary }}
      >
        {step.description}
      </p>
    </div>
  );
}

export default function WhatsInside() {
  const colors = BRAND_CONFIG.brand.colors;
  const whatsInside = getSalesSection('whatsInside');

  return (
    <section
      id="whats-inside"
      className="py-20"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" style={{ color: colors.accent }} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.accent }}
            >
              Sneak Peek
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {whatsInside.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {whatsInside.subheadline}
          </p>
        </div>

        {/* Visual Previews Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          {whatsInside.visualPreviews.map((preview, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Image Placeholder */}
              <div
                className="h-48 flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${colors.backgroundTertiary} 0%, ${colors.background} 100%)`,
                }}
              >
                <Eye
                  className="w-12 h-12 opacity-30"
                  style={{ color: colors.textMuted }}
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}10` }}
                >
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }}
                  >
                    Preview
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                <h4
                  className="font-semibold mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  {preview.title}
                </h4>
                {preview.description && (
                  <p
                    className="text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    {preview.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        {whatsInside.howItWorks && whatsInside.howItWorks.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3
              className="text-2xl font-bold text-center mb-8"
              style={{ color: colors.textPrimary }}
            >
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {whatsInside.howItWorks.map((step, index) => (
                <StepCard key={index} step={step} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
