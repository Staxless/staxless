// /pages/index.js

// Importing components used on the landing page
import Footer from "@/components/Footer";
import CTA from "@/components/landing/cta/simpleCta";
import FAQ from "@/components/landing/faq/accordianFaq";
import Features from "@/components/landing/features/features3";
import Hero from "@/components/landing/hero/splitHero";
import Pricing from "@/components/landing/pricing/oneTimePricing";
import Navbar from "@/components/Navbar";
import Head from "next/head";

/**
 * Home - The main landing page of the application.
 *
 * This component displays the landing page, which includes a Navbar, Hero section,
 * Features section, FAQ, Pricing, CTA (Call to Action), and Footer.
 *
 * @returns {JSX.Element} A landing page layout with all sections.
 */
export default function Home() {
  return (
    <div>
      {/* Head component to set the page title and meta description */}
      <Head>
        <title>Landing Page</title>
        <meta
          name="description"
          content="Landing page built with Next.js and ShadCN"
        />
      </Head>

      {/* Main content of the landing page */}
      <main>
        <Navbar /> {/* Navigation bar */}
        <Hero /> {/* Hero section with the main introductory content */}
        <Features />
        {/* Features section showcasing the product's capabilities */}
        <FAQ /> {/* FAQ section with common questions */}
        <Pricing /> {/* Pricing section for a one-time payment option */}
        <CTA /> {/* Call to Action section prompting the user to take action */}
        <Footer /> {/* Footer section with additional links and information */}
      </main>
    </div>
  );
}
