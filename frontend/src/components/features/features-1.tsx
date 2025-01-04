/**
 * @file Features Component
 * @module Features
 * @description A React component that displays a list of product features with interactive tabs.
 */

"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

// Types and Interfaces
type Feature = {
  title: string;
  description: string;
  image: string;
  details: string[];
};

// Array of feature items
const features: Feature[] = [
  {
    title: "Intuitive Dashboard",
    description:
      "Get a bird's-eye view of your entire workflow with our customizable dashboard.",
    image: "/placeholder.svg",
    details: [
      "Drag-and-drop widgets for easy customization",
      "Real-time data updates",
      "Personalized views for each team member",
      "Integration with all major project management tools",
    ],
  },
  {
    title: "Smart Automation",
    description: "Automate repetitive tasks and focus on what really matters.",
    image: "/placeholder.svg",
    details: [
      "AI-powered task assignment",
      "Automated report generation",
      "Customizable workflow triggers",
      "Integration with popular productivity apps",
    ],
  },
  {
    title: "Advanced Analytics",
    description:
      "Make data-driven decisions with our powerful analytics suite.",
    image: "/placeholder.svg",
    details: [
      "Interactive data visualizations",
      "Predictive analysis for project outcomes",
      "Custom report builder",
      "Export capabilities for all major formats",
    ],
  },
];

/**
 * @function Features
 * @description Renders a section displaying product features with interactive tabs.
 * @returns {JSX.Element} The Features component.
 */
export default function Features(): JSX.Element {
  const [activeFeature, setActiveFeature] = useState(0);

  /**
   * @function handleKeyDown
   * @description Handles keyboard navigation for accessibility.
   * @param {KeyboardEvent<HTMLDivElement>} event - The keyboard event.
   * @param {number} index - The index of the feature.
   */
  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      setActiveFeature(index);
      event.preventDefault();
    }
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Powerful Features to Boost Your Productivity
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover how our tools can transform your workflow
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3" role="tablist" aria-label="Feature list">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`mb-6 p-4 rounded-lg cursor-pointer transition-colors ${
                  activeFeature === index
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveFeature(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="tab"
                tabIndex={0}
                aria-selected={activeFeature === index}
                aria-controls={`feature-panel-${index}`}
                id={`feature-tab-${index}`}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p
                  className={
                    activeFeature === index
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="lg:w-2/3">
            {features.map((feature, index) => (
              <div
                key={index}
                role="tabpanel"
                id={`feature-panel-${index}`}
                aria-labelledby={`feature-tab-${index}`}
                hidden={activeFeature !== index}
                className="bg-card rounded-lg shadow-lg p-8"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={800}
                  height={450}
                  className="rounded-lg mb-8"
                />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <ul className="space-y-4 mb-8">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <ChevronRight className="w-5 h-5 text-primary mr-2 mt-1" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
