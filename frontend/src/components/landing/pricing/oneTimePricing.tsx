import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
};

const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for individuals and small teams",
    features: ["1 user", "10 projects", "5GB storage", "Basic support"],
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    description: "Great for growing businesses",
    features: [
      "5 users",
      "50 projects",
      "100GB storage",
      "Priority support",
      "Advanced analytics",
    ],
    buttonText: "Try Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale organizations",
    features: [
      "Unlimited users",
      "Unlimited projects",
      "1TB storage",
      "24/7 dedicated support",
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that &#39 s right for you
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col p-6 bg-card rounded-lg shadow-lg border border-primary/10"
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 text-4xl font-bold">{plan.price}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" size="lg">
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
