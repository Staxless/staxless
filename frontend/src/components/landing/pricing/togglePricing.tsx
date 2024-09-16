import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type PricingPlan = {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  buttonText: string;
};

const plans: PricingPlan[] = [
  {
    name: "Basic",
    monthlyPrice: "$19",
    yearlyPrice: "$190",
    description: "For individuals and small teams",
    features: ["1 user", "10 projects", "5GB storage", "Basic support"],
    buttonText: "Get Basic",
  },
  {
    name: "Pro",
    monthlyPrice: "$49",
    yearlyPrice: "$490",
    description: "For growing businesses",
    features: [
      "5 users",
      "50 projects",
      "100GB storage",
      "Priority support",
      "Advanced analytics",
    ],
    buttonText: "Go Pro",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    description: "For large organizations",
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
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Flexible plans for every need</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the perfect plan for your business
          </p>
          <div className="mt-8 flex items-center justify-center">
            <span
              className={`mr-3 ${isYearly ? "text-muted-foreground" : "font-semibold"}`}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={`ml-3 ${isYearly ? "font-semibold" : "text-muted-foreground"}`}
            >
              Yearly (Save 20%)
            </span>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col p-6 bg-card rounded-lg shadow-lg border border-primary/10"
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-4 text-4xl font-bold">
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-base font-normal text-muted-foreground">
                  {plan.name !== "Enterprise" &&
                    (isYearly ? "/year" : "/month")}
                </span>
              </div>
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
