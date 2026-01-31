'use client';

import { TrendingUp, Quote } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type CaseStudy } from '@config/sales-config';

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header with Avatar */}
      <div
        className="p-6 pb-4"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: colors.background }}
            >
              {study.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {study.name}
            </h3>
            {study.role && (
              <p
                className="text-sm"
                style={{ color: colors.textMuted }}
              >
                {study.role}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Before & After */}
      <div className="p-6 pt-4">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Before */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: `${colors.error}10`,
              border: `1px solid ${colors.error}20`,
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.error }}
            >
              Before
            </span>
            <p
              className="text-sm mt-2"
              style={{ color: colors.textSecondary }}
            >
              {study.beforeSituation}
            </p>
          </div>

          {/* After */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}20`,
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.success }}
            >
              After
            </span>
            <p
              className="text-sm mt-2"
              style={{ color: colors.textSecondary }}
            >
              {study.afterSituation}
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-6">
          <Quote
            className="w-6 h-6 mb-2 opacity-30"
            style={{ color: colors.primary }}
          />
          <p
            className="text-base italic"
            style={{ color: colors.textSecondary }}
          >
            "{study.testimonial}"
          </p>
        </div>

        {/* Results */}
        <div className="space-y-2">
          {study.results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
            >
              <TrendingUp
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.success }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                {result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const colors = BRAND_CONFIG.brand.colors;
  const caseStudies = getSalesSection('caseStudies');

  if (!caseStudies.studies || caseStudies.studies.length === 0) return null;

  return (
    <section
      id="case-studies"
      className="py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {caseStudies.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {caseStudies.subheadline}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {caseStudies.studies.map((study, index) => (
            <CaseStudyCard key={index} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
