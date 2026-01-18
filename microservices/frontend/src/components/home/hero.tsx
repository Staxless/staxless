'use client';

import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white px-4 pt-20">
      <div className="container relative z-10 mx-auto max-w-5xl py-12 text-center">
        <h1 className="mb-8 font-medium text-4xl text-gray-900 leading-tight md:text-6xl">
          <span>{BRAND_CONFIG.content.hero.title} </span>
          <span className="font-medium text-black">
            {BRAND_CONFIG.content.hero.titleHighlight}
          </span>
          <br />
          <span>{BRAND_CONFIG.content.hero.titleEnd}</span>
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-gray-600 text-xl leading-relaxed md:text-2xl">
          {BRAND_CONFIG.content.hero.subtitle}
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button
            className="min-w-[200px] rounded-lg bg-black px-8 py-4 font-medium text-lg text-white hover:bg-gray-800"
            size="lg"
          >
            {BRAND_CONFIG.content.hero.primaryCTA}
          </Button>
          <Button
            className="min-w-[200px] rounded-lg border-gray-300 px-8 py-4 text-gray-900 text-lg"
            size="lg"
            variant="outline"
          >
            {BRAND_CONFIG.content.hero.secondaryCTA}
          </Button>
        </div>

        {/* App mockup placeholder */}
        <div className="mt-20">
          <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <span className="font-bold text-2xl text-white">
                    {BRAND_CONFIG.company.name.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-500">Your SaaS dashboard preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
