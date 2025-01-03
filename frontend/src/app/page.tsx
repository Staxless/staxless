/**
 * @file app/page.tsx
 * @description Main landing page component for the application
 */

import { Metadata } from "next";
import Footer from "@/components/Footer";
import CTA from "@/components/landing/cta/simpleCta";
import FAQ from "@/components/landing/faq/accordianFaq";
import Features from "@/components/landing/features/features3";
import Hero from "@/components/landing/hero/splitHero";
import Pricing from "@/components/landing/pricing/oneTimePricing";
import Pricing2 from "@/components/landing/pricing/togglePricing";
import Navbar from "@/app/Navbar";

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing page built with Next.js and ShadCN",
};

/**
 * Home - The main landing page of the application.
 * This component displays the landing page, which includes a Navbar, Hero section,
 * Features section, FAQ, Pricing, CTA (Call to Action), and Footer.
 *
 * @returns {JSX.Element} A landing page layout with all sections.
 */
export default function Home(): JSX.Element {
  return (
    <div>
      <main>
        <Navbar />
        <Hero />
        <Features />
        <FAQ />
        <Pricing />
        <Pricing2 />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
