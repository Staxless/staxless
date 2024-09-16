import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

/**
 * WaitlistHeroSimple Component
 *
 * This component displays a section where users can join a waitlist by entering
 * their email address. It includes a heading, a description, an email input field,
 * a submit button, and a message about early bird discounts.
 *
 * @module WaitlistHeroSimple
 * @returns {JSX.Element} The rendered WaitlistHeroSimple component
 */
export default function WaitlistHeroSimple() {
  const [email, setEmail] = useState<string>("");

  /**
   * Handles the form submission.
   *
   * Prevents the default form submission behavior, logs the submitted email,
   * displays a success toast notification, and clears the email input.
   *
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your API
    console.log("Submitted email:", email);
    toast({
      title: "You're on the list!",
      description: "We'll notify you when we launch. Stay tuned!",
    });
    setEmail("");
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">
            The Future of [Your Product] is Coming
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Be the first to experience our revolutionary new platform. Join the
            waitlist today and get early access when we launch!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm"
              required
            />
            <Button type="submit" size="lg">
              Join the Waitlist
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Join {Math.floor(Math.random() * 900) + 100} others eagerly waiting.
            Limited spots available!
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="bg-primary/10 rounded-lg p-6 inline-flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-semibold text-primary">
              Early birds get 50% off at launch!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
