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
  Boxes,
  Terminal,
  Plus,
  Rocket,
  Layout,
  Grid,
  Paintbrush,
  Wrench,
  Server,
  Cloud,
  GitBranch,
  Key,
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
  Boxes,
  Terminal,
  Plus,
  Rocket,
  Layout,
  Grid,
  Paintbrush,
  Wrench,
  Server,
  Cloud,
  GitBranch,
  Key,
};

function FeatureCard({ feature }: { feature: Feature }) {
  const colors = BRAND_CONFIG.brand.colors;
  const Icon = feature.icon ? iconMap[feature.icon] || Zap : Zap;

  return (
    <div
      className="p-6 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-lg h-full"
      style={{
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
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
        className="text-sm mb-4 leading-relaxed"
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
          style={{ color: colors.primary }}
        >
          ✓ {feature.benefit}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const colors = BRAND_CONFIG.brand.colors;
  const features = getSalesSection('features');

  // Handle both flat array (legacy) and categorized structure
  const hasCategories = 'categories' in features && Array.isArray(features.categories);

  return (
    <section
      id="features"
      className="py-20 md:py-28"
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

        {/* Categorized Features */}
        {hasCategories ? (
          <div className="max-w-6xl mx-auto space-y-16">
            {features.categories.map((category, catIndex) => (
              <div key={catIndex}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  {category.emoji && (
                    <span className="text-2xl">{category.emoji}</span>
                  )}
                  <h3
                    className="text-xl md:text-2xl font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {category.name}
                  </h3>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat Features Grid (legacy support) */
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(features as any).features?.map((feature: Feature, index: number) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
