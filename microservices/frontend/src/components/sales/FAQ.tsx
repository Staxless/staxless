'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, type FAQItem } from '@config/sales-config';

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:opacity-90"
        style={{
          backgroundColor: isOpen ? `${colors.primary}10` : 'transparent',
        }}
        aria-expanded={isOpen}
      >
        <span
          className="font-medium pr-4"
          style={{ color: colors.textPrimary }}
        >
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: colors.textMuted }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p
          className="p-4 pt-0 text-base"
          style={{ color: colors.textSecondary }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const colors = BRAND_CONFIG.brand.colors;
  const faq = getSalesSection('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5" style={{ color: colors.accent }} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.accent }}
            >
              FAQ
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {faq.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {faq.subheadline}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faq.questions.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-xl mx-auto mt-12">
          <div
            className="p-6 rounded-xl text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundTertiary} 100%)`,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: colors.textPrimary }}
            >
              Still have questions?
            </h3>
            <p
              className="text-base mb-4"
              style={{ color: colors.textSecondary }}
            >
              We're here to help. Reach out anytime.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {faq.contactInfo.email && (
                <Link
                  href={`mailto:${faq.contactInfo.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email Us</span>
                </Link>
              )}

              {faq.contactInfo.chatAvailable && (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: `${colors.success}20`,
                    color: colors.success,
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Live Chat</span>
                </button>
              )}

              {faq.contactInfo.supportUrl && (
                <Link
                  href={faq.contactInfo.supportUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent,
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Help Center</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
