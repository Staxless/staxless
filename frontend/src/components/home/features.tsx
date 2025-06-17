"use client"

import {
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
} from "lucide-react"
import { BRAND_CONFIG } from "@/lib/brand-config"

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
}

export default function Features() {
  return (
    <section id="features" className="py-20" style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            {BRAND_CONFIG.content.features.title}
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
            {BRAND_CONFIG.content.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRAND_CONFIG.content.features.items.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
            return (
              <div
                key={index}
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <IconComponent className="w-12 h-12 mb-4" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                  {feature.title}
                </h3>
                <p style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
