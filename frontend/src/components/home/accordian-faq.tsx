"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BRAND_CONFIG } from "@/lib/brand-config"

export default function FAQ() {
  return (
    <section className="py-20" style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            {BRAND_CONFIG.content.faq.title}
          </h2>
          <p className="text-xl" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
            {BRAND_CONFIG.content.faq.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {BRAND_CONFIG.content.faq.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg px-6 border"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <AccordionTrigger
                  className="text-left font-semibold hover:no-underline"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
