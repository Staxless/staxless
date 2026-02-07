'use client';

import { Eye } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Credibility Note */}
        {whatsInside.credibilityNote && (
          <p
            className="text-center text-sm mt-8 font-medium"
            style={{ color: colors.textMuted }}
          >
            {whatsInside.credibilityNote}
          </p>
        )}
      </div>
    </section>
  );
}
