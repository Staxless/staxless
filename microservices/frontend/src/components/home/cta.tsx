'use client';

import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function CTA() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 font-bold text-4xl text-white">
          {BRAND_CONFIG.content.cta.title}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-blue-100 text-xl">
          {BRAND_CONFIG.content.cta.subtitle}
        </p>
        <Button
          className="px-8 py-3 text-lg"
          size="lg"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.textPrimary,
            color: BRAND_CONFIG.brand.colors.primary,
          }}
          variant="secondary"
        >
          {BRAND_CONFIG.content.cta.buttonText}
        </Button>
      </div>
    </section>
  );
}
