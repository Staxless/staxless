'use client';

import { Clock, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, getDaysUntilDeadline } from '@config/sales-config';

export default function Urgency() {
  const colors = BRAND_CONFIG.brand.colors;
  const urgency = getSalesSection('urgency');
  const daysLeft = getDaysUntilDeadline();

  // Don't render if no urgency type
  if (urgency.type === 'none') return null;

  return (
    <section
      className="py-12"
      style={{
        background: `linear-gradient(135deg, ${colors.warning}10 0%, ${colors.error}10 100%)`,
        borderTop: `1px solid ${colors.warning}30`,
        borderBottom: `1px solid ${colors.warning}30`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${colors.warning}20` }}
          >
            {urgency.type === 'limited-spots' ? (
              <Users className="w-8 h-8" style={{ color: colors.warning }} />
            ) : (
              <Clock className="w-8 h-8" style={{ color: colors.warning }} />
            )}
          </div>

          {/* Headline */}
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {urgency.headline}
          </h2>

          {/* Description */}
          <p
            className="text-lg mb-6"
            style={{ color: colors.textSecondary }}
          >
            {urgency.description}
          </p>

          {/* Countdown or Spots */}
          {urgency.type === 'limited-time' && daysLeft !== null && daysLeft > 0 && (
            <div className="flex justify-center gap-4 mb-6">
              <div
                className="px-6 py-4 rounded-lg text-center"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.warning }}
                >
                  {daysLeft}
                </div>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Days Left
                </div>
              </div>
            </div>
          )}

          {urgency.type === 'limited-spots' && urgency.spotsAvailable && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: `${colors.error}20`,
                color: colors.error,
              }}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">
                Only {urgency.spotsAvailable} spots remaining
              </span>
            </div>
          )}

          {/* CTA */}
          {urgency.ctaText && (
            <Link href="#pricing">
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.warning,
                  color: colors.background,
                }}
              >
                {urgency.ctaText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
