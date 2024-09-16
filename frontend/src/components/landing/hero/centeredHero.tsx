/**
 * Hero Component
 *
 * This component renders a hero section with a background image, overlay, and
 * central text content. It includes a heading, description, and two call-to-action
 * buttons styled for visibility against the background.
 *
 * @module Hero
 * @returns {JSX.Element} The rendered Hero component
 */

import { Button } from "@/components/ui/button";

/**
 * Hero Component
 *
 * This component showcases a prominent hero section of a landing page with a background
 * image, overlay, and a centered content area that includes a title, description, and
 * call-to-action buttons.
 *
 * @returns {JSX.Element} The Hero section of the landing page
 */
export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-32 text-white"
      style={{ backgroundImage: "url('/placeholder.svg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Revolutionize Your Workflow
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Streamline your processes, boost productivity, and achieve more with
            our innovative platform.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-gray-200"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-white hover:bg-white hover:text-black"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
