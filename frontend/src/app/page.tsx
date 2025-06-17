// "use client"

import CTA from "@/components/home/cta"
import FAQ from "@/components/home/accordian-faq"
import Features from "@/components/home/features"
import Hero from "@/components/home/hero"
import Pricing from "@/components/home/pricing"
import Footer from "@/components/shared/footer"
import Header from "@/components/shared/header"
import { headers } from "next/headers"

export default async function Home() {
    const headersList = await headers()
      const userInfoString = headersList.get("x-user-info")
      const user = userInfoString ? JSON.parse(userInfoString) : null
  return (
    <div className="min-h-screen">
      <Header user={user} />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
