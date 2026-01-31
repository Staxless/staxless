'use client';

import HeroHook from './HeroHook';
import CurrentReality from './CurrentReality';
import Transformation from './Transformation';
import EstablishTrust from './EstablishTrust';
import Solution from './Solution';
import Features from './Features';
import Outcomes from './Outcomes';
import Reassurance from './Reassurance';
import SocialProof from './SocialProof';
import Bonus from './Bonus';
import Urgency from './Urgency';
import WhatsInside from './WhatsInside';
import PurchasePitch from './PurchasePitch';
import CaseStudies from './CaseStudies';
import WhyDifferent from './WhyDifferent';
import WhoItsFor from './WhoItsFor';
import FAQ from './FAQ';
import SalesFooter from './SalesFooter';
import Header from '../shared/header';
import Footer from '../shared/footer';

/**
 * SalesPage - Complete sales/landing page component
 *
 * All copy and content is pulled from /lib/sales-config.ts
 * Edit the config file to customize all text, features, testimonials, etc.
 *
 * Sections are arranged for optimal conversion flow:
 * 1. Hero Hook - Capture attention
 * 2. Current Reality - Agitate pain points
 * 3. Transformation - Paint the vision
 * 4. Establish Trust - Build credibility
 * 5. Solution - Introduce your offer
 * 6. Features - Detail what's included
 * 7. Outcomes - Summarize results
 * 8. Social Proof - Show testimonials
 * 9. Case Studies - Deep-dive success stories
 * 10. Reassurance - Address objections
 * 11. Why Different - Compare alternatives
 * 12. Who It's For - Qualify audience
 * 13. Bonus - Add value
 * 14. Urgency - Create FOMO
 * 15. What's Inside - Visual previews
 * 16. Purchase Pitch - Pricing & CTA
 * 17. FAQ - Handle questions
 * 18. Footer - Legal & social links
 */
export default function SalesPage() {
  return (
    <main className="min-h-screen">

      <Header />
      {/* Section 1: Hero Hook */}
      <HeroHook />

      {/* Section 2: Address Current Reality */}
      <CurrentReality />

      {/* Section 3: The Transformation */}
      <Transformation />

      {/* Section 4: Establish Trust */}
      <EstablishTrust />

      {/* Section 5: The Solution */}
      <Solution />

      {/* Section 6: Features & Benefits */}
      <Features />

      {/* Section 7: Outcomes */}
      <Outcomes />

      {/* Section 8: Social Proof */}
      <SocialProof />

      {/* Section 9: Case Studies */}
      <CaseStudies />

      {/* Section 10: Reassurance */}
      <Reassurance />

      {/* Section 11: Why Different */}
      <WhyDifferent />

      {/* Section 12: Who It's For */}
      <WhoItsFor />

      {/* Section 13: Bonuses */}
      <Bonus />

      {/* Section 14: Urgency */}
      <Urgency />

      {/* Section 15: What's Inside */}
      <WhatsInside />

      {/* Section 16: Purchase Pitch (Pricing) */}
      <PurchasePitch />

      {/* Section 17: FAQ */}
      <FAQ />

      {/* Section 18: Footer */}
      <Footer />
    </main>
  );
}
