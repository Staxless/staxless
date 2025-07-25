'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 font-bold text-4xl"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            {BRAND_CONFIG.content.faq.title}
          </h2>
          <p
            className="text-xl"
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            {BRAND_CONFIG.content.faq.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-4" collapsible type="single">
            {BRAND_CONFIG.content.faq.items.map((item: FaqItem) => (
              <AccordionItem
                className="rounded-lg border px-6"
                key={item.id}
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                }}
                value={item.id}
              >
                <AccordionTrigger
                  className="text-left font-semibold hover:no-underline"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent
                  className="pb-4"
                  style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
