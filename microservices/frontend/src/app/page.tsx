import type { Metadata } from 'next';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import HeroHook from '@/components/sales/HeroHook';
import CurrentReality from '@/components/sales/CurrentReality';
import Transformation from '@/components/sales/Transformation';
import EstablishTrust from '@/components/sales/EstablishTrust';
import Solution from '@/components/sales/Solution';
import Features from '@/components/sales/Features';
import Outcomes from '@/components/sales/Outcomes';
import SocialProof from '@/components/sales/SocialProof';
import CaseStudies from '@/components/sales/CaseStudies';
import Reassurance from '@/components/sales/Reassurance';
import WhyDifferent from '@/components/sales/WhyDifferent';
import WhoItsFor from '@/components/sales/WhoItsFor';
import Bonus from '@/components/sales/Bonus';
import Urgency from '@/components/sales/Urgency';
import WhatsInside from '@/components/sales/WhatsInside';
import PurchasePitch from '@/components/sales/PurchasePitch';
import FAQ from '@/components/sales/FAQ';

export const metadata: Metadata = {
  title: `${getSalesSection('solution').offerName} | ${BRAND_CONFIG.company.name}`,
  description: getSalesSection('hero').subheadline,
  openGraph: {
    type: 'website',
    title: `${getSalesSection('hero').headline} ${getSalesSection('hero').headlineHighlight || ''}`,
    description: getSalesSection('hero').subheadline,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${getSalesSection('hero').headline} ${getSalesSection('hero').headlineHighlight || ''}`,
    description: getSalesSection('hero').subheadline,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroHook />
      <CurrentReality />
      <Transformation />
      <EstablishTrust />
      <Solution />
      <Features />
      <Outcomes />
      <SocialProof />
      <CaseStudies />
      <Reassurance />
      <WhyDifferent />
      <WhoItsFor />
      <Bonus />
      <Urgency />
      <WhatsInside />
      <PurchasePitch />
      <FAQ />
      <Footer />
    </main>
  );
}
