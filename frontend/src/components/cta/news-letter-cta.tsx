/**
 * @file CTA (Call To Action) Component
 * @module CTA
 * @description A React component for subscribing to a newsletter.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

/**
 * @function CTA
 * @description Renders a Call To Action component for newsletter subscription.
 * @returns {JSX.Element} The CTA component.
 */
export default function CTA(): JSX.Element {
  const [email, setEmail] = useState<string>("");

  /**
   * @function handleSubmit
   * @description Handles the form submission for newsletter subscription.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your API
    console.log("Submitted email:", email);
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-xl mb-8">
            Get the latest news, tips, and exclusive offers delivered directly
            to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground text-primary"
              required
            />
            <Button type="submit" size="lg" variant="secondary">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-sm opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
