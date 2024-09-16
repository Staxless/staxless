/**
 * Hero Component
 *
 * This component renders a hero section with a central heading, description,
 * and a call-to-action button. It includes a visual representation of the platform
 * using a placeholder image, with a dynamic and visually appealing layout.
 *
 * @module Hero
 * @returns {JSX.Element} The rendered Hero component
 */

import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * Hero Component
 *
 * This component displays the hero section of a landing page, with text content that
 * highlights the platform's features and a call-to-action button. The section also
 * includes an image that enhances the visual appeal.
 *
 * @returns {JSX.Element} The Hero section for the webpage
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Text content area */}
            <div className="relative z-10 flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Empower Your Digital Journey
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Transform your online presence with our cutting-edge platform.
                Seamlessly integrate, automate, and elevate your digital
                experience.
              </p>
              <div className="mt-8">
                <Button size="lg" className="rounded-full">
                  Get Started Now
                </Button>
              </div>
            </div>

            {/* Image content area */}
            <div className="relative lg:mt-0">
              <Image
                src="./placeholder.svg"
                alt="Dashboard preview"
                width={600}
                height={400}
                className="relative z-10 rounded-2xl shadow-xl ring-1 ring-gray-900/10"
              />
              {/* Decorative background elements */}
              <div className="absolute -top-4 -right-4 h-72 w-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 h-72 w-72 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
