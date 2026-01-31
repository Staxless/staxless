'use client';

import {
  BookOpen,
  FileText,
  Users,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  Zap,
  Star,
  Shield,
  Layers,
  Target,
  Lightbulb,
} from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type Feature } from '@config/sales-config';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Users,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  Zap,
  Star,
  Shield,
  Layers,
  Target,
  Lightbulb,
};

function FeatureCard({ feature }: { feature: Feature }) {
  const colors = BRAND_CONFIG.brand.colors;
  const Icon = feature.icon ? iconMap[feature.icon] || Zap : Zap;

  return (
    <div
      className="p-6 rounded-xl transition-all hover:scale-[1.02] h-full"
      style={{
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: colors.primary }} />
      </div>

      {/* Headline */}
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: colors.textPrimary }}
      >
        {feature.headline}
      </h3>

      {/* Description */}
      <p
        className="text-sm mb-4"
        style={{ color: colors.textSecondary }}
      >
        {feature.description}
      </p>

      {/* Benefit */}
      <div
        className="pt-4 border-t"
        style={{ borderColor: colors.border }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: colors.accent }}
        >
          → {feature.benefit}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const colors = BRAND_CONFIG.brand.colors;
  const features = getSalesSection('features');

  return (
    <section
      id="features"
      className="py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {features.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {features.subheadline}
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
