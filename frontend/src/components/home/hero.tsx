"use client"

import { Button } from "@/components/ui/button"
import { BRAND_CONFIG } from "@/lib/brand-config"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-white pt-20">
      <div className="container mx-auto text-center max-w-5xl relative z-10 py-12">
        <h1 className="text-4xl md:text-6xl font-medium mb-8 leading-tight text-gray-900">
          <span>{BRAND_CONFIG.content.hero.title} </span>
          <span className="text-black font-medium">{BRAND_CONFIG.content.hero.titleHighlight}</span>
          <br />
          <span>{BRAND_CONFIG.content.hero.titleEnd}</span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-600">
          {BRAND_CONFIG.content.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            className="text-lg px-8 py-4 font-medium rounded-lg min-w-[200px] bg-black text-white hover:bg-gray-800"
          >
            {BRAND_CONFIG.content.hero.primaryCTA}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 rounded-lg min-w-[200px] border-gray-300 text-gray-900"
          >
            {BRAND_CONFIG.content.hero.secondaryCTA}
          </Button>
        </div>

        {/* App mockup placeholder */}
        <div className="mt-20">
          <div className="mx-auto max-w-4xl rounded-lg p-6 bg-gray-50 border border-gray-200">
            <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{BRAND_CONFIG.company.name.charAt(0)}</span>
                </div>
                <p className="text-gray-500">Your SaaS dashboard preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
