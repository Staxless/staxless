import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type FAQItem = {
  question: string;
  answer: string;
};

// Array of frequently asked questions and their answers
const faqItems: FAQItem[] = [
  {
    question: "How do I get started?",
    answer:
      "Getting started is easy! Simply sign up for an account on our website, choose your plan, and you'll have immediate access to our platform. We also offer a guided onboarding process to help you get up to speed quickly.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express, Discover) as well as PayPal. For enterprise customers, we also offer invoicing options.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial for all our plans. No credit card is required to start your trial. You'll have full access to all features during the trial period.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll continue to have access until the end of your current billing period.",
  },
  {
    question: "Do you offer phone support?",
    answer:
      "We offer phone support for our Enterprise plan customers. For all other plans, we provide support via email and live chat, with typical response times under 2 hours during business hours.",
  },
  {
    question: "Are there any setup fees?",
    answer:
      "No, there are no setup fees for any of our standard plans. You only pay for your subscription. For enterprise customers requiring custom setup or integration, there may be additional fees, which will be discussed during the sales process.",
  },
];

/**
 * FAQ component displays a list of frequently asked questions in a card format.
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
            Find quick answers to common queries
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
