// "use client"

import { headers } from 'next/headers';
import FAQ from '@/components/home/accordion-faq';
import CTA from '@/components/home/cta';
import Features from '@/components/home/features';
import Hero from '@/components/home/hero';
import Pricing from '@/components/home/pricing';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default async function Home() {
  const headersList = await headers();
  const userInfoString = headersList.get('x-user-info');
  const user = userInfoString ? JSON.parse(userInfoString) : null;
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
  );
}
