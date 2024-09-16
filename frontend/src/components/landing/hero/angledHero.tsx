/**
 * Hero Component
 *
 * This component renders a hero section for the landing page, including a title,
 * description, action buttons, and a promotional image. It features a background
 * gradient and overlay elements for visual effects.
 *
 * @module Hero
 * @returns {JSX.Element} The rendered Hero component
 */

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Hero Component
 *
 * This component is used to showcase the main features of the platform and encourage
 * users to engage with the site through action buttons. It includes a headline, a
 * description, and a call-to-action with buttons, along with a visually appealing
 * image and background effects.
 *
 * @returns {JSX.Element} The Hero section of the landing page
 */
export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/20 to-secondary/20 py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2 lg:pr-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Unlock Your Business Potential
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Harness the power of our platform to scale your operations,
              automate workflows, and drive growth like never before.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="rounded-full">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <div className="relative">
              <Image
                src="./public/placeholder.svg"
                alt="App interface"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -left-4 h-72 w-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-72 w-72 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-lg shadow-lg p-4">
                <div className="text-2xl font-bold text-primary">200%</div>
                <div className="text-sm text-muted-foreground">
                  Productivity Boost
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
