/**
 * @file app/page.tsx
 * @description Main landing page component for the application
 */

"use client"

import { useTheme } from "../contexts/ThemeContext"
import CTA from "@/components/cta/cta"
import FAQ from "@/components/faq/accordian-faq"
import Features from "@/components/features/features"
import Hero from "@/components/hero/hero"
import Pricing from "@/components/pricing/pricing"
import Footer from "@/components/shared/footer"
import Header , {HeaderProps } from "@/components/shared/header"



/**
 * Home - The main landing page of the application.
 * This component displays the landing page, which includes a Navbar, Hero section,
 * Features section, FAQ, Pricing, CTA (Call to Action), and Footer.
 *
 * @returns {JSX.Element} A landing page layout with all sections.
 */
export default function Home({user}: HeaderProps): JSX.Element {
  const colors = useTheme()

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <main>
        <Header user={user} />
        <Hero />
        <Features />
        <FAQ />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </div>
  )
}

