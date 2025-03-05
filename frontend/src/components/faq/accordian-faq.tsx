/**
 * @file FAQ Component
 * @module FAQ
 * @description A React component that displays a list of frequently asked questions with expandable answers.
 */

"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
// Types and Interfaces
type FAQItem = {
  question: string
  answer: string
}

// Array of frequently asked questions and their answers
const faqItems: FAQItem[] = [
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for all our products. If you're not satisfied, you can request a full refund within 30 days of your purchase, no questions asked.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our customer support team via email at support@example.com or through the live chat feature on our website. Our support hours are Monday to Friday, 9 AM to 5 PM EST.",
  },
  {
    question: "Do you offer discounts for non-profit organizations?",
    answer:
      "Yes, we offer special discounts for registered non-profit organizations. Please contact our sales team with proof of your non-profit status to learn more about our discount program.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "You can upgrade your plan at any time. When you upgrade, you'll be charged the prorated difference for the remainder of your billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security measures and regularly undergo third-party security audits to ensure your data is protected.",
  },
]

/**
 * @function FAQ
 * @description Renders a FAQ section with expandable questions and answers.
 * @returns {JSX.Element} The FAQ component.
 */
export default function FAQ(): JSX.Element {
  const colors = useTheme()

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16"          
        initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}>
          <h2 className="text-3xl font-bold" style={{ color: colors.text }}>
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl" style={{ color: colors.muted }}>
            Find answers to common questions about our services
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        <motion.div className="text-center mb-16"          
        initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} style={{ borderColor: colors.muted }}>
              <AccordionTrigger className="text-left" style={{ color: colors.text }}>
                {item.question}
              </AccordionTrigger>
              <AccordionContent style={{ color: colors.muted }}>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </motion.div>
        </Accordion>
        
      </div>
    </section>
  )
}

