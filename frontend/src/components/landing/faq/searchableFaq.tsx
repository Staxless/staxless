import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

// Array of frequently asked questions and their answers
const faqItems: FAQItem[] = [
  {
    question: "What platforms do you support?",
    answer:
      "We support all major platforms including Windows, macOS, iOS, and Android. Our web application works on any modern browser, ensuring you can access your data from any device.",
  },
  {
    question: "How often do you release updates?",
    answer:
      "We typically release minor updates and bug fixes every two weeks. Major feature updates are released quarterly. All updates are automatically applied to ensure you always have the latest version.",
  },
  {
    question: "Can I import data from other tools?",
    answer:
      "Yes, we offer data import functionality for most popular tools in our industry. You can import data via CSV files or through our API. For specific import questions, please contact our support team.",
  },
  {
    question: "Do you offer custom integrations?",
    answer:
      "Yes, we offer custom integrations for our Enterprise plan customers. Our team can work with you to develop integrations with your existing tools and workflows. Contact our sales team for more information.",
  },
  {
    question: "What kind of customer support do you provide?",
    answer:
      "We offer multi-tiered support based on your plan. All customers have access to our extensive knowledge base and community forums. Higher-tier plans include email support, live chat, and dedicated account managers for enterprise customers.",
  },
  {
    question: "Is training available for new users?",
    answer:
      "Yes, we offer various training options. All plans include access to our video tutorial library. We also offer live webinar training sessions for teams, and personalized onboarding for enterprise customers.",
  },
  {
    question: "How do you handle data backups?",
    answer:
      "We perform daily backups of all customer data. These backups are encrypted and stored in geographically diverse locations to ensure data safety and availability. We retain daily backups for 30 days and monthly backups for one year.",
  },
];

/**
 * FAQ component with search functionality to filter frequently asked questions.
 *
 * @returns {JSX.Element} - The FAQ component.
 */
export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqItems);

  /**
   * Filters the FAQ items based on the search term.
   */
  const handleSearch = () => {
    const filtered = faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredFAQs(filtered);
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Find answers to your questions quickly
          </p>
        </div>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {filteredFAQs.map((item, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
        {filteredFAQs.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No matching questions found. Please try a different search term.
          </p>
        )}
      </div>
    </section>
  );
}
