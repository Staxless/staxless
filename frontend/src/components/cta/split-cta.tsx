/**
 * @file SplitCTAWithImage Component
 * @module SplitCTAWithImage
 * @description A React component that displays a call-to-action section with an image and text block.
 */

import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * @function SplitCTAWithImage
 * @description Renders a split layout CTA section with an image and text content.
 * @returns {JSX.Element} The SplitCTAWithImage component.
 */
export default function SplitCTAWithImage(): JSX.Element {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Image
              src="/placeholder.svg"
              alt="Product showcase"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Transform Your Workflow Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the power of our platform and see how it can
              revolutionize your business processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg">Get Started Now</Button>
              <Button size="lg" variant="outline">
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
