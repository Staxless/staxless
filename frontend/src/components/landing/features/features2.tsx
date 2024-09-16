/**
 * Features Component
 *
 * This component displays a set of features for a product or service. It uses a tabbed interface to allow users
 * to switch between different features and view their details, including images and benefits.
 *
 * @module Features
 * @returns {JSX.Element} The rendered Features component
 */

"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * Interface definition for a feature.
 */
interface Feature {
  title: string;
  description: string;
  image: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    title: "Task Management",
    description:
      "Efficiently organize and prioritize your tasks with our intuitive task management system. Create, assign, and track tasks with ease, ensuring nothing falls through the cracks.",
    image: "/placeholder.svg",
    benefits: [
      "Drag-and-drop interface for easy organization",
      "Customizable workflows to match your process",
      "Real-time updates and notifications",
      "Collaborative task comments and file attachments",
    ],
  },
  {
    title: "Time Tracking",
    description:
      "Accurately track time spent on projects and tasks. Our time tracking feature helps you understand where your time is going and optimize your productivity.",
    image: "/placeholder.svg",
    benefits: [
      "One-click time tracking for seamless recording",
      "Detailed time reports and analytics",
      "Integration with billing and invoicing",
      "Mobile app for tracking on-the-go",
    ],
  },
  {
    title: "Team Collaboration",
    description:
      "Foster teamwork and communication with our powerful collaboration tools. Share ideas, files, and updates in real-time, keeping everyone aligned and informed.",
    image: "/placeholder.svg",
    benefits: [
      "Centralized communication hub",
      "File sharing and version control",
      "Team calendars and scheduling",
      "Role-based access control for security",
    ],
  },
];

export default function Features() {
  const [activeTab, setActiveTab] = useState(features[0].title);

  /**
   * Handles tab change by updating the active tab state.
   *
   * @param {string} tab - The title of the selected tab.
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Explore Our Features</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover the tools that will revolutionize your workflow
          </p>
        </div>
        <Tabs
          defaultValue={features[0].title}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-3">
            {features.map((feature) => (
              <TabsTrigger key={feature.title} value={feature.title}>
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {features.map((feature) => (
            <TabsContent key={feature.title} value={feature.title}>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="mt-6">
                    Learn More
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
