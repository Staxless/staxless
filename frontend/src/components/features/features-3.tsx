/**
 * @file Features Component
 * @module Features
 * @description Displays a list of features with associated icons and descriptions in a responsive grid layout.
 */

import {
  type LucideIcon,
  Zap,
  Shield,
  BarChart,
  Users,
  Globe,
  Clock,
  Smartphone,
  Cloud,
  Lock,
} from "lucide-react";

// Types and Interfaces
type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

// Array of feature items
const features: Feature[] = [
  {
    title: "Lightning Fast",
    description:
      "Experience blazing fast performance with our optimized platform.",
    icon: Zap,
  },
  {
    title: "Bank-grade Security",
    description:
      "Your data is protected with the highest level of security measures.",
    icon: Shield,
  },
  {
    title: "Advanced Analytics",
    description: "Gain valuable insights with our powerful analytics tools.",
    icon: BarChart,
  },
  {
    title: "Team Collaboration",
    description: "Work seamlessly with your team members in real-time.",
    icon: Users,
  },
  {
    title: "Global Accessibility",
    description: "Access your work from anywhere in the world, anytime.",
    icon: Globe,
  },
  {
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help you.",
    icon: Clock,
  },
  {
    title: "Mobile Friendly",
    description: "Use our platform on any device with our responsive design.",
    icon: Smartphone,
  },
  {
    title: "Cloud Integration",
    description: "Seamlessly integrate with popular cloud services.",
    icon: Cloud,
  },
  {
    title: "Data Encryption",
    description:
      "Your data is encrypted in transit and at rest for maximum security.",
    icon: Lock,
  },
];

/**
 * @function Features
 * @description Renders a section displaying a grid of feature cards.
 * @returns {JSX.Element} The Features component.
 */
export default function Features(): JSX.Element {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover what makes our platform stand out
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
