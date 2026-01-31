'use client';

import { Star, Quote } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type Testimonial } from '@config/sales-config';

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="p-6 rounded-xl h-full flex flex-col"
      style={{
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-current"
              style={{ color: colors.warning }}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <div className="flex-1 mb-4">
        <Quote
          className="w-8 h-8 mb-2 opacity-30"
          style={{ color: colors.primary }}
        />
        <p
          className="text-base italic"
          style={{ color: colors.textSecondary }}
        >
          "{testimonial.quote}"
        </p>
      </div>

      {/* Result Badge */}
      {testimonial.result && (
        <div
          className="inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{
            backgroundColor: `${colors.success}20`,
            color: colors.success,
          }}
        >
          {testimonial.result}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
        {/* Avatar Placeholder */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.secondary}30 100%)`,
          }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: colors.primary }}
          >
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <p
            className="font-semibold"
            style={{ color: colors.textPrimary }}
          >
            {testimonial.name}
          </p>
          {(testimonial.role || testimonial.company) && (
            <p
              className="text-sm"
              style={{ color: colors.textMuted }}
            >
              {testimonial.role}
              {testimonial.role && testimonial.company && ' at '}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SocialProof() {
  const colors = BRAND_CONFIG.brand.colors;
  const socialProof = getSalesSection('socialProof');

  return (
    <section className="py-20" style={{ backgroundColor: colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {socialProof.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {socialProof.subheadline}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {socialProof.testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
