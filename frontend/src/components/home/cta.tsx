"use client"

import { Button } from "@/components/ui/button"
import { BRAND_CONFIG } from "@/lib/brand-config"

export default function CTA() {
  return (
    <section className="py-20" style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">{BRAND_CONFIG.content.cta.title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">{BRAND_CONFIG.content.cta.subtitle}</p>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg px-8 py-3"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.textPrimary,
            color: BRAND_CONFIG.brand.colors.primary,
          }}
        >
          {BRAND_CONFIG.content.cta.buttonText}
        </Button>
      </div>
    </section>
  )
}
