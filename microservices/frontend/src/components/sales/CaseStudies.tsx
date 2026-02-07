'use client';

import { Quote } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type CaseStudy } from '@config/sales-config';

function TestimonialCard({ study }: { study: CaseStudy }) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="rounded-xl overflow-hidden p-6"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Quote Icon */}
      <Quote
        className="w-8 h-8 mb-4 opacity-30"
        style={{ color: colors.primary }}
      />

      {/* Testimonial Quote */}
      <p
        className="text-lg italic mb-6 leading-relaxed"
        style={{ color: colors.textSecondary }}
      >
        "{study.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: colors.background }}
          >
            {study.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3
            className="font-semibold"
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
      style={{ backgroundColor: colors.backgroundSecondary }}
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

        {/* Testimonials Grid */}
        <div
          className={`max-w-4xl mx-auto ${
            caseStudies.studies.length === 1
              ? 'max-w-2xl'
              : 'grid md:grid-cols-2 gap-6'
          }`}
        >
          {caseStudies.studies.map((study, index) => (
            <TestimonialCard key={index} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
