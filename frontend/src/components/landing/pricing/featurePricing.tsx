import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";

type PricingPlan = {
  name: string;
  price: string;
  buttonText: string;
};

type Feature = {
  name: string;
  [key: string]: string | boolean;
};

const plans: PricingPlan[] = [
  { name: "Free", price: "$0", buttonText: "Get started" },
  { name: "Pro", price: "$49", buttonText: "Try it free" },
  { name: "Enterprise", price: "Custom", buttonText: "Contact us" },
];

const features: Feature[] = [
  { name: "Users", free: "1", pro: "5", enterprise: "Unlimited" },
  { name: "Projects", free: "3", pro: "50", enterprise: "Unlimited" },
  { name: "Storage", free: "1GB", pro: "100GB", enterprise: "1TB" },
  {
    name: "Support",
    free: "Community",
    pro: "Priority",
    enterprise: "24/7 Dedicated",
  },
  { name: "Analytics", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { name: "API Access", free: false, pro: true, enterprise: true },
  { name: "Custom Integrations", free: false, pro: false, enterprise: true },
];

export default function Pricing() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Compare our plans</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Find the perfect plan for your needs
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Features</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="p-4 text-center">
                    <div className="text-2xl font-bold">{plan.name}</div>
                    <div className="mt-2 text-3xl font-bold">{plan.price}</div>
                    <div className="mt-4">
                      <Button size="sm">{plan.buttonText}</Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b">
                  <td className="p-4 font-medium">{feature.name}</td>
                  {plans.map((plan) => (
                    <td
                      key={`${feature.name}-${plan.name}`}
                      className="p-4 text-center"
                    >
                      {feature[plan.name.toLowerCase()] === false ? (
                        <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                      ) : feature[plan.name.toLowerCase()] === true ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        feature[plan.name.toLowerCase()]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
