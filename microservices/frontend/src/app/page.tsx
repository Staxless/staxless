import FAQ from '@/components/home/accordion-faq';
import CTA from '@/components/home/cta';
import Features from '@/components/home/features';
import Hero from '@/components/home/hero';
import Pricing from '@/components/home/pricing';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
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
