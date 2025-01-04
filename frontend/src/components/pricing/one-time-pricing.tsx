/**
 * @file OneTimePricing Component
 * @module OneTimePricing
 * @description Renders a pricing section for one-time purchase plans.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProducts, Product } from "@/app/server-actions/get-products";

// Constants
const CACHE_KEY = "pricingPlans";
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hour in milliseconds

/**
 * @function OneTimePricing
 * @description Renders a pricing section with one-time purchase plans.
 * @returns {JSX.Element} The OneTimePricing component
 */
export default function OneTimePricing(): JSX.Element {
  const [plans, setPlans] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);

        // Check for cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            setPlans(data);
            setIsLoading(false);
            return;
          }
        }

        // If no valid cache, fetch from API
        const products = await getProducts();
        console.log("Products fetched:", products);
        setPlans(products);

        // Cache the fetched data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: products,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load pricing plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  console.log("Rendering plans:", plans);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(plans) || plans.length === 0) {
    return (
      <div className="text-center text-yellow-500 p-4">
        <p>No pricing plans are currently available.</p>
      </div>
    );
  }

  return (
    <section className="bg-background py-20 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 w-full max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that&#39;s right for you
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan) => {
            const formattedPrice = plan.default_price
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: plan.default_price.currency,
                  minimumFractionDigits: 0,
                }).format(plan.default_price.unit_amount / 100) +
                (plan.default_price.recurring
                  ? `/${plan.default_price.recurring.interval}`
                  : "")
              : "Price not available";

            return (
              <div
                key={plan.id}
                className="flex flex-col p-6 bg-card rounded-lg shadow-lg border border-primary/10 w-full max-w-sm"
              >
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-2 text-3xl font-bold">{formattedPrice}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6 flex-grow">
                  <h4 className="text-lg font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/auth/register?tier=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.default_price.id)}`}
                  passHref
                >
                  <Button className="mt-8 w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
