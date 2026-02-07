'use client';

import { ArrowRight, Play, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

export default function HeroHook() {
  const colors = BRAND_CONFIG.brand.colors;
  const hero = getSalesSection('hero');

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at top, ${colors.primary}15 0%, transparent 50%)`,
        }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.secondary }}
      />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: colors.accent }}
      />

      <div className="container mx-auto px-4 py-25 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              backgroundColor: `${colors.primary}10`,
              border: `1px solid ${colors.primary}30`,
            }}
          >
            <Terminal className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Build Simple. Scale Smart. Stay Secure.
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span style={{ color: colors.textPrimary }}>{hero.headline}</span>
            {hero.headlineHighlight && (
              <>
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {hero.headlineHighlight}
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            {hero.subheadline}
          </p>

          {/* Tech Stack Badges */}
          {hero.techStack && hero.techStack.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {hero.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={hero.ctaUrl}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-semibold transition-all hover:scale-105 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 20px ${colors.primary}40`,
                }}
              >
                {hero.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {hero.secondaryCtaText && hero.secondaryCtaUrl && (
              <Link href={hero.secondaryCtaUrl}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 font-semibold transition-all hover:scale-105 rounded-xl"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {hero.secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>

          {/* CLI Preview */}
          <div
            className="max-w-md mx-auto p-4 rounded-xl text-left font-mono text-sm"
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
            <div className="space-y-1">
              <p>
                <span style={{ color: '#94A3B8' }}>$</span>{' '}
                <span style={{ color: colors.accent }}>staxless</span>{' '}
                <span style={{ color: '#F8FAFC' }}>init</span>
              </p>
              <p style={{ color: '#10B981' }}>✓ Project initialized</p>
              <p>
                <span style={{ color: '#94A3B8' }}>$</span>{' '}
                <span style={{ color: colors.accent }}>staxless</span>{' '}
                <span style={{ color: '#F8FAFC' }}>dev start</span>
              </p>
              <p style={{ color: '#10B981' }}>✓ All services running</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2"
          style={{ borderColor: colors.textMuted }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: colors.textMuted }}
          />
        </div>
      </div>
    </section>
  );
}
