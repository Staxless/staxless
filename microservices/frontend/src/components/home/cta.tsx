'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function CTA() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <section className="py-20" style={{ backgroundColor: colors.primary }}>
      <div className="container mx-auto px-4 text-center">
        <h2
          className="mb-6 font-bold text-4xl"
          style={{ color: colors.background }}
        >
          {BRAND_CONFIG.content.cta.title}
        </h2>
        <p
          className="mx-auto mb-8 max-w-2xl text-xl opacity-90"
          style={{ color: colors.background }}
        >
          {BRAND_CONFIG.content.cta.subtitle}
        </p>
        <Link href="/register">
          <Button
            className="px-8 py-3 text-lg transition-colors"
            size="lg"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
            }}
            variant="secondary"
          >
            {BRAND_CONFIG.content.cta.buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
