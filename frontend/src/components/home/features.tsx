'use client';

import {
  BarChart,
  CreditCard,
  DollarSign,
  Lock,
  Rocket,
  Settings,
  Shield,
  Sliders,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const iconMap = {
  Shield,
  Zap,
  CreditCard,
  Users,
  BarChart,
  Settings,
  Lock,
  DollarSign,
  User,
  TrendingUp,
  Rocket,
  Sliders,
};

export default function Features() {
  return (
    <section
      className="py-20"
      id="features"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 font-bold text-4xl"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            {BRAND_CONFIG.content.features.title}
          </h2>
          <p
            className="mx-auto max-w-2xl text-xl"
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            {BRAND_CONFIG.content.features.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BRAND_CONFIG.content.features.items.map((feature: FeatureItem) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                className="rounded-lg border p-6 shadow-lg transition-shadow hover:shadow-xl"
                key={feature.id}
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                }}
              >
                <IconComponent
                  className="mb-4 h-12 w-12"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
                <h3
                  className="mb-2 font-semibold text-xl"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
