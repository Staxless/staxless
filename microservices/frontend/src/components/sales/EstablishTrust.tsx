'use client';

import { Award, Users, Clock, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function EstablishTrust() {
  const colors = BRAND_CONFIG.brand.colors;
  const trust = getSalesSection('trust');

  return (
    <section className="py-20" style={{ backgroundColor: colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: colors.textPrimary }}
          >
            {trust.headline}
          </h2>

          {/* Founder Introduction */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            {/* Founder Image Placeholder */}
            <div
              className="w-32 h-32 md:w-48 md:h-48 rounded-2xl flex-shrink-0 mx-auto md:mx-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.secondary}30 100%)`,
                border: `2px solid ${colors.border}`,
              }}
            >
              <span
                className="text-4xl font-bold"
                style={{ color: colors.primary }}
              >
                {trust.founderName.charAt(0)}
              </span>
            </div>

            {/* Founder Info */}
            <div className="flex-1">
              <h3
                className="text-2xl font-bold mb-1"
                style={{ color: colors.textPrimary }}
              >
                {trust.founderName}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: colors.textMuted }}
              >
                {trust.founderTitle}
              </p>
              <p
                className="text-lg mb-6"
                style={{ color: colors.textSecondary }}
              >
                {trust.introduction}
              </p>

              {/* Credibility Stats */}
              <div className="flex flex-wrap gap-4">
                {trust.credibility.monthsBuilding && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      {trust.credibility.monthsBuilding}+ months building
                    </span>
                  </div>
                )}
                {trust.credibility.commits && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Users className="w-4 h-4" style={{ color: colors.primary }} />
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      {trust.credibility.commits}+ commits
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Backstory */}
          <div className="space-y-4 mb-8">
            {trust.backstory.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Pivotal Moment */}
          <div
            className="p-6 rounded-xl mb-8 border-l-4"
            style={{
              backgroundColor: colors.background,
              borderLeftColor: colors.primary,
            }}
          >
            <p
              className="text-lg italic"
              style={{ color: colors.textPrimary }}
            >
              "{trust.pivotalMoment}"
            </p>
          </div>

          {/* Achievements */}
          {trust.credibility.achievements && trust.credibility.achievements.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {trust.credibility.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: `${colors.success}10`,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <Award className="w-4 h-4" style={{ color: colors.success }} />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Secret Ingredient & Drumroll */}
          <div className="text-center">
            <p
              className="text-lg mb-4"
              style={{ color: colors.textSecondary }}
            >
              My secret? I call it{' '}
              <span
                className="font-bold"
                style={{ color: colors.primary }}
              >
                {trust.secretIngredient}
              </span>
            </p>
            <p
              className="text-xl font-medium mb-6"
              style={{ color: colors.textPrimary }}
            >
              {trust.drumrollText}
            </p>
            <div className="flex items-center justify-center gap-2">
              <ArrowRight
                className="w-6 h-6 animate-pulse"
                style={{ color: colors.accent }}
              />
              <span
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: colors.accent }}
              >
                Scroll to discover
              </span>
              <ArrowRight
                className="w-6 h-6 animate-pulse"
                style={{ color: colors.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
