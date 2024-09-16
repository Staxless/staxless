import { Button } from "@/components/ui/button";

/**
 * CTA (Call To Action) component for encouraging users to start a free trial
 * or schedule a demo.
 *
 * This component displays a section with a heading, a brief description, and
 * two call-to-action buttons for starting a free trial or scheduling a demo.
 *
 * @returns {JSX.Element} - The CTA component.
 */
export default function CTA() {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
          Ready to get started?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
          Join thousands of satisfied customers and take your business to the
          next level with our powerful platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
