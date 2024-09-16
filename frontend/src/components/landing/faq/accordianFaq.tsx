import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

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
];

/**
 * FAQ component displays a list of frequently asked questions with expandable answers.
 *
 * @returns {JSX.Element} - The FAQ component.
 */
export default function FAQ() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Find answers to common questions about our services
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
