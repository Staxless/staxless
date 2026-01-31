/**
 * @file Sales Page Configuration
 * @description Centralized configuration for the sales/landing page content.
 * All copy and content should be edited here - components pull from this config.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroSection {
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  heroImage?: string;
}

export interface CurrentRealitySection {
  headline: string;
  introText: string;
  painPoints: string[];
  empathyStatement: string;
  transitionText: string;
}

export interface TransformationSection {
  headline: string;
  visionStatement: string;
  champagneMoments: string[];
  withoutPainPoints: string[];
  closingStatement: string;
}

export interface TrustSection {
  headline: string;
  founderName: string;
  founderImage?: string;
  founderTitle: string;
  introduction: string;
  backstory: string[];
  pivotalMoment: string;
  credibility: {
    yearsExperience?: number;
    peopleHelped?: number;
    achievements?: string[];
  };
  secretIngredient: string;
  drumrollText: string;
}

export interface SolutionSection {
  offerIntro: string;
  offerName: string;
  tagline: string;
  keyBenefits: string[];
  productImage?: string;
}

export interface Feature {
  headline: string;
  description: string;
  icon?: string;
  benefit: string;
}

export interface FeaturesSection {
  headline: string;
  subheadline: string;
  features: Feature[];
}

export interface ImaginationPrompt {
  champagneMoment: string;
  withoutPainPoint: string;
}

export interface OutcomesSection {
  headline: string;
  resultStatement: string;
  outcomeDetails: string[];
  imaginationPrompts: ImaginationPrompt[];
  closingStatement: string;
}

export interface Differentiator {
  title: string;
  description: string;
}

export interface ReassuranceSection {
  headline: string;
  subheadline: string;
  differentiators: Differentiator[];
}

export interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  image?: string;
  result?: string;
  rating?: number;
}

export interface SocialProofSection {
  headline: string;
  subheadline: string;
  testimonials: Testimonial[];
}

export interface Bonus {
  name: string;
  description: string;
  value?: string;
  image?: string;
}

export interface BonusSection {
  headline: string;
  subheadline: string;
  bonuses: Bonus[];
}

export interface UrgencySection {
  type: 'limited-time' | 'limited-spots' | 'bonus-expiration' | 'none';
  headline: string;
  description: string;
  deadline?: string;
  spotsAvailable?: number;
  ctaText?: string;
}

export interface VisualPreview {
  title: string;
  description?: string;
  image: string;
  alt: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface WhatsInsideSection {
  headline: string;
  subheadline: string;
  visualPreviews: VisualPreview[];
  howItWorks?: HowItWorksStep[];
}

export interface PaymentPlan {
  name: string;
  payments: number;
  amountPerPayment: number;
}

export interface PricingPackage {
  name: string;
  description: string;
  features: string[];
  price: number;
  originalPrice?: number;
  paymentPlan?: PaymentPlan;
  popular?: boolean;
  ctaText: string;
  productId?: string;
}

export interface PurchasePitchSection {
  headline: string;
  subheadline: string;
  packages: PricingPackage[];
  paymentMethods: string[];
  guaranteeText: string;
  reminderText: string;
}

export interface CaseStudy {
  name: string;
  role?: string;
  beforeSituation: string;
  afterSituation: string;
  testimonial: string;
  results: string[];
  image?: string;
}

export interface CaseStudiesSection {
  headline: string;
  subheadline: string;
  studies: CaseStudy[];
}

export interface Comparison {
  aspect: string;
  otherSolutions: string;
  yourSolution: string;
}

export interface WhyDifferentSection {
  headline: string;
  subheadline: string;
  comparisons: Comparison[];
  closingStatement: string;
}

export interface WhoItsForSection {
  headline: string;
  subheadline: string;
  rightFor: string[];
  notRightFor: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  supportUrl?: string;
  chatAvailable?: boolean;
}

export interface FAQSection {
  headline: string;
  subheadline: string;
  questions: FAQItem[];
  contactInfo: ContactInfo;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterSection {
  links: FooterLink[];
  copyright: string;
  socialMedia: SocialLink[];
}

export interface SalesPageConfig {
  hero: HeroSection;
  currentReality: CurrentRealitySection;
  transformation: TransformationSection;
  trust: TrustSection;
  solution: SolutionSection;
  features: FeaturesSection;
  outcomes: OutcomesSection;
  reassurance: ReassuranceSection;
  socialProof: SocialProofSection;
  bonus: BonusSection;
  urgency: UrgencySection;
  whatsInside: WhatsInsideSection;
  purchasePitch: PurchasePitchSection;
  caseStudies: CaseStudiesSection;
  whyDifferent: WhyDifferentSection;
  whoItsFor: WhoItsForSection;
  faq: FAQSection;
  footer: FooterSection;
}

// ============================================================================
// SALES PAGE CONFIGURATION
// ============================================================================

export const SALES_CONFIG: SalesPageConfig = {
  // -------------------------------------------------------------------------
  // SECTION 1: THE HERO HOOK
  // -------------------------------------------------------------------------
  hero: {
    headline: 'Stop Struggling with',
    headlineHighlight: 'Outdated Solutions',
    subheadline:
      'Discover how hundreds of professionals are achieving breakthrough results without the frustration, wasted time, or costly mistakes.',
    ctaText: 'Get Started Today',
    ctaUrl: '#pricing',
    secondaryCtaText: 'See How It Works',
    secondaryCtaUrl: '#whats-inside',
    heroImage: '/images/hero-mockup.png',
  },

  // -------------------------------------------------------------------------
  // SECTION 2: ADDRESSING THE CURRENT REALITY
  // -------------------------------------------------------------------------
  currentReality: {
    headline: 'Sound Familiar?',
    introText: "Can I be real with you for a moment?",
    painPoints: [
      "You've tried countless solutions, but nothing seems to stick",
      "You're spending hours on tasks that should take minutes",
      "You feel overwhelmed by information but starved for results",
      "You're watching others succeed while you're stuck in the same place",
      "You know there has to be a better way, but you haven't found it yet",
    ],
    empathyStatement:
      "If that sounds like you, you're not alone. I've helped hundreds of people who felt exactly the same way.",
    transitionText:
      "And that's why I made it my mission to find a better way. Here's the thing — it doesn't have to be this hard.",
  },

  // -------------------------------------------------------------------------
  // SECTION 3: THE TRANSFORMATION
  // -------------------------------------------------------------------------
  transformation: {
    headline: 'Imagine a Different Reality',
    visionStatement:
      'What if you could finally break through the barriers holding you back?',
    champagneMoments: [
      'Waking up excited about your progress instead of dreading another day of struggle',
      'Having a clear roadmap that tells you exactly what to do next',
      'Seeing real, measurable results within weeks, not months or years',
      "Feeling confident in your abilities and proud of what you've built",
      'Having the freedom to focus on what truly matters to you',
    ],
    withoutPainPoints: [
      'Without spending thousands on courses that collect dust',
      'Without wasting hours on trial and error',
      'Without feeling lost or overwhelmed',
      'Without sacrificing your personal life',
    ],
    closingStatement:
      "This isn't just a dream — it's exactly what our members experience every day.",
  },

  // -------------------------------------------------------------------------
  // SECTION 4: ESTABLISH TRUST & THE DRUMROLL
  // -------------------------------------------------------------------------
  trust: {
    headline: 'Hey, I Get It',
    founderName: 'Your Name',
    founderImage: '/images/founder.jpg',
    founderTitle: 'Founder & Creator',
    introduction:
      "I'm the creator of this program, and I'm here to help you transform your results.",
    backstory: [
      "A few years ago, I was exactly where you are now. Frustrated, overwhelmed, and convinced there had to be a better way.",
      "I spent years trying every solution I could find. Some worked a little, most didn't work at all. I wasted thousands of dollars and countless hours.",
      "Then something clicked. I discovered a systematic approach that changed everything.",
      "I went from struggling to thriving. And now I've refined this system to help others do the same — in a fraction of the time it took me.",
    ],
    pivotalMoment:
      "The moment I realized I couldn't keep doing things the old way was the moment everything changed.",
    credibility: {
      yearsExperience: 10,
      peopleHelped: 500,
      achievements: [
        'Featured in industry publications',
        'Spoken at major conferences',
        'Built a thriving community of practitioners',
      ],
    },
    secretIngredient: 'The Breakthrough Method',
    drumrollText:
      "I've packaged everything I've learned into a comprehensive system. And now, I'm thrilled to share it with you.",
  },

  // -------------------------------------------------------------------------
  // SECTION 5: THE SOLUTION/YOUR OFFER
  // -------------------------------------------------------------------------
  solution: {
    offerIntro: 'Introducing',
    offerName: 'The Complete System',
    tagline: 'Your roadmap to breakthrough results',
    keyBenefits: [
      'A proven step-by-step framework that eliminates guesswork',
      'Actionable strategies you can implement immediately',
      'Ongoing support to ensure your success',
    ],
    productImage: '/images/product-mockup.png',
  },

  // -------------------------------------------------------------------------
  // SECTION 6: FEATURES AND BENEFITS
  // -------------------------------------------------------------------------
  features: {
    headline: "Here's What You Get",
    subheadline:
      'Everything you need to achieve breakthrough results, all in one place.',
    features: [
      {
        headline: 'Core Training Modules',
        description:
          'Comprehensive video lessons that walk you through every step of the process.',
        icon: 'BookOpen',
        benefit: 'Learn at your own pace with clear, actionable guidance',
      },
      {
        headline: 'Templates & Frameworks',
        description:
          'Done-for-you templates that eliminate the blank page problem.',
        icon: 'FileText',
        benefit: 'Save hours of work with ready-to-use resources',
      },
      {
        headline: 'Community Access',
        description:
          'Connect with like-minded individuals on the same journey.',
        icon: 'Users',
        benefit: 'Get support, accountability, and inspiration',
      },
      {
        headline: 'Expert Q&A Sessions',
        description: 'Regular live sessions to get your questions answered.',
        icon: 'MessageCircle',
        benefit: 'Never feel stuck or alone on your journey',
      },
      {
        headline: 'Progress Tracking',
        description: 'Built-in tools to monitor your advancement.',
        icon: 'TrendingUp',
        benefit: 'Stay motivated by seeing your growth',
      },
      {
        headline: 'Lifetime Updates',
        description:
          'Get access to all future improvements at no extra cost.',
        icon: 'RefreshCw',
        benefit: 'Always have the most current strategies',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 7: THE OUTCOMES
  // -------------------------------------------------------------------------
  outcomes: {
    headline: 'The Bottom Line',
    resultStatement:
      'All of this adds up to one thing: breakthrough results you can actually achieve.',
    outcomeDetails: [
      'Clear direction instead of confusion',
      'Consistent progress instead of stagnation',
      'Confidence instead of doubt',
      'Results instead of excuses',
    ],
    imaginationPrompts: [
      {
        champagneMoment: 'Celebrating your first major win',
        withoutPainPoint: 'without months of trial and error',
      },
      {
        champagneMoment: 'Having a proven system that works',
        withoutPainPoint: 'without spending a fortune on coaching',
      },
      {
        champagneMoment: 'Feeling proud of your transformation',
        withoutPainPoint: 'without sacrificing your wellbeing',
      },
    ],
    closingStatement:
      "Once you implement what you learn, you'll wonder why you waited so long.",
  },

  // -------------------------------------------------------------------------
  // SECTION 8: THE REASSURANCE
  // -------------------------------------------------------------------------
  reassurance: {
    headline: 'Why This Works',
    subheadline:
      "Here's what makes this different from everything else you've tried.",
    differentiators: [
      {
        title: 'Proven Framework',
        description:
          'This isn\'t theory — it\'s a battle-tested system refined by working with hundreds of people.',
      },
      {
        title: 'Practical Focus',
        description:
          'No fluff or filler. Every piece of content is designed to get you results.',
      },
      {
        title: 'Ongoing Support',
        description:
          "You're not alone on this journey. Get help when you need it.",
      },
      {
        title: 'Results Guarantee',
        description:
          "If you don't see results, we'll work with you until you do — or refund your investment.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 9: SOCIAL PROOF AND TESTIMONIALS
  // -------------------------------------------------------------------------
  socialProof: {
    headline: 'What Our Members Say',
    subheadline:
      'Real results from real people who took the leap and transformed their outcomes.',
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Marketing Director',
        company: 'TechStartup Inc',
        quote:
          'This program completely changed my approach. Within 3 months, I achieved more than I had in the previous 2 years.',
        image: '/images/testimonials/sarah.jpg',
        result: '300% improvement in results',
        rating: 5,
      },
      {
        name: 'Michael Chen',
        role: 'Entrepreneur',
        quote:
          'I was skeptical at first, but the framework just works. The community support is incredible too.',
        image: '/images/testimonials/michael.jpg',
        result: 'Launched successfully in 6 weeks',
        rating: 5,
      },
      {
        name: 'Emily Rodriguez',
        role: 'Freelance Consultant',
        quote:
          'Finally, a program that delivers on its promises. The templates alone saved me countless hours.',
        image: '/images/testimonials/emily.jpg',
        result: 'Doubled productivity',
        rating: 5,
      },
      {
        name: 'David Park',
        role: 'Small Business Owner',
        quote:
          'The step-by-step approach made it so easy to follow. I knew exactly what to do at each stage.',
        image: '/images/testimonials/david.jpg',
        result: 'Achieved goals 3x faster',
        rating: 5,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 10: BUT WAIT, THERE'S MORE!
  // -------------------------------------------------------------------------
  bonus: {
    headline: 'But Wait, There\'s More!',
    subheadline:
      'Join today and get these exclusive bonuses absolutely free.',
    bonuses: [
      {
        name: 'Quick Start Guide',
        description:
          'A condensed action plan to get you results in your first week.',
        value: '$97',
        image: '/images/bonus-quickstart.png',
      },
      {
        name: 'Private Podcast Series',
        description:
          'Behind-the-scenes insights and advanced strategies for your commute.',
        value: '$147',
        image: '/images/bonus-podcast.png',
      },
      {
        name: 'VIP Community Access',
        description:
          'One month of premium community membership with priority support.',
        value: '$97',
        image: '/images/bonus-community.png',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 11: WHY BUY NOW?
  // -------------------------------------------------------------------------
  urgency: {
    type: 'limited-time',
    headline: 'Special Launch Pricing',
    description:
      'Get in now at our lowest price ever. This special offer ends soon, and the price will increase.',
    deadline: '2024-02-29',
    ctaText: 'Lock In Your Spot',
  },

  // -------------------------------------------------------------------------
  // SECTION 12: WHAT'S INSIDE
  // -------------------------------------------------------------------------
  whatsInside: {
    headline: 'Take a Peek Inside',
    subheadline:
      'Here\'s a preview of what you\'ll get access to the moment you join.',
    visualPreviews: [
      {
        title: 'Dashboard Overview',
        description: 'Your command center for tracking progress.',
        image: '/images/preview-dashboard.png',
        alt: 'Dashboard showing progress tracking',
      },
      {
        title: 'Training Modules',
        description: 'Step-by-step video lessons.',
        image: '/images/preview-modules.png',
        alt: 'Training module interface',
      },
      {
        title: 'Template Library',
        description: 'Ready-to-use templates and frameworks.',
        image: '/images/preview-templates.png',
        alt: 'Template library view',
      },
      {
        title: 'Community Forum',
        description: 'Connect with fellow members.',
        image: '/images/preview-community.png',
        alt: 'Community forum interface',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Join Today',
        description: 'Complete your enrollment in just 2 minutes.',
        icon: 'UserPlus',
      },
      {
        step: 2,
        title: 'Get Instant Access',
        description: 'Dive into the training immediately.',
        icon: 'Unlock',
      },
      {
        step: 3,
        title: 'Start Transforming',
        description: 'Follow the roadmap and see results.',
        icon: 'Rocket',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 13: PURCHASE PITCH
  // -------------------------------------------------------------------------
  purchasePitch: {
    headline: 'Ready to Get Started?',
    subheadline: 'Choose the plan that works best for you.',
    packages: [
      {
        name: 'Essential',
        description: 'Perfect for getting started',
        features: [
          'Core training modules',
          'Basic templates',
          'Community access',
          'Email support',
        ],
        price: 97,
        ctaText: 'Get Essential',
        productId: 'prod_essential',
      },
      {
        name: 'Professional',
        description: 'Most popular choice',
        features: [
          'Everything in Essential',
          'Advanced training',
          'All templates & frameworks',
          'Live Q&A sessions',
          'Priority support',
          'All bonuses included',
        ],
        price: 197,
        originalPrice: 297,
        popular: true,
        ctaText: 'Get Professional',
        productId: 'prod_professional',
      },
      {
        name: 'Premium',
        description: 'For serious achievers',
        features: [
          'Everything in Professional',
          '1-on-1 strategy session',
          'Private coaching access',
          'Custom implementation plan',
          'Lifetime updates',
          'VIP community badge',
        ],
        price: 497,
        originalPrice: 797,
        paymentPlan: {
          name: '3 Monthly Payments',
          payments: 3,
          amountPerPayment: 177,
        },
        ctaText: 'Get Premium',
        productId: 'prod_premium',
      },
    ],
    paymentMethods: ['visa', 'mastercard', 'amex', 'paypal'],
    guaranteeText:
      '30-Day Money-Back Guarantee. If you\'re not completely satisfied, we\'ll refund every penny.',
    reminderText:
      'Join hundreds of others who have already transformed their results.',
  },

  // -------------------------------------------------------------------------
  // SECTION 14: MORE CASE STUDIES
  // -------------------------------------------------------------------------
  caseStudies: {
    headline: 'Success Stories',
    subheadline:
      'See how others just like you have achieved breakthrough results.',
    studies: [
      {
        name: 'Jennifer Martinez',
        role: 'Career Changer',
        beforeSituation:
          'Stuck in a dead-end job, unsure how to make a change.',
        afterSituation:
          'Successfully transitioned to her dream role within 4 months.',
        testimonial:
          'The framework gave me the confidence and clarity I needed. I can\'t believe how different my life is now.',
        results: [
          'Landed dream job in 4 months',
          'Increased salary by 40%',
          'Better work-life balance',
        ],
        image: '/images/case-studies/jennifer.jpg',
      },
      {
        name: 'Robert Williams',
        role: 'Business Owner',
        beforeSituation:
          'Business was stagnant, working long hours with little to show for it.',
        afterSituation:
          'Doubled revenue while working fewer hours.',
        testimonial:
          'This program helped me work smarter, not harder. The ROI has been incredible.',
        results: [
          '2x revenue in 6 months',
          'Reduced working hours by 30%',
          'Built a team of 5',
        ],
        image: '/images/case-studies/robert.jpg',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 15: WHY IT'S DIFFERENT
  // -------------------------------------------------------------------------
  whyDifferent: {
    headline: 'How We\'re Different',
    subheadline:
      'This isn\'t just another program. Here\'s what sets us apart.',
    comparisons: [
      {
        aspect: 'Approach',
        otherSolutions: 'Theory-heavy content you never implement',
        yourSolution: 'Action-focused system with immediate application',
      },
      {
        aspect: 'Support',
        otherSolutions: 'Left on your own after purchase',
        yourSolution: 'Ongoing community and expert support',
      },
      {
        aspect: 'Results',
        otherSolutions: 'Vague promises with no accountability',
        yourSolution: 'Clear milestones with progress tracking',
      },
      {
        aspect: 'Value',
        otherSolutions: 'Expensive with hidden upsells',
        yourSolution: 'All-inclusive with lifetime access',
      },
    ],
    closingStatement:
      'We\'re committed to your success, not just your enrollment.',
  },

  // -------------------------------------------------------------------------
  // SECTION 16: WHO IT'S RIGHT FOR
  // -------------------------------------------------------------------------
  whoItsFor: {
    headline: 'Is This Right For You?',
    subheadline: 'This program is designed for a specific type of person.',
    rightFor: [
      'You\'re ready to invest in yourself and your growth',
      'You\'re willing to put in the work to see results',
      'You value having a proven roadmap over figuring it out alone',
      'You\'re open to new approaches and willing to try something different',
      'You want accountability and support on your journey',
    ],
    notRightFor: [
      'You\'re looking for a magic pill with no effort required',
      'You\'re not ready to commit time to the process',
      'You prefer to figure everything out on your own',
      'You\'re not open to changing your current approach',
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 17: FAQ/CONTACT
  // -------------------------------------------------------------------------
  faq: {
    headline: 'Frequently Asked Questions',
    subheadline:
      'Got questions? We\'ve got answers. If you don\'t see your question here, reach out!',
    questions: [
      {
        question: 'What exactly is included in the program?',
        answer:
          'You get access to all training modules, templates, community, live Q&A sessions, and bonuses. Check the features section above for a complete breakdown.',
      },
      {
        question: 'How long will I have access?',
        answer:
          'You get lifetime access to all current and future content. No recurring fees.',
      },
      {
        question: 'Do I need any prior experience?',
        answer:
          'No! The program is designed for beginners and advanced practitioners alike. We meet you where you are.',
      },
      {
        question: 'What if it doesn\'t work for me?',
        answer:
          'We offer a 30-day money-back guarantee. If you\'re not satisfied, email us for a full refund. No questions asked.',
      },
      {
        question: 'How is the content delivered?',
        answer:
          'Everything is delivered through our online platform. You can access it from any device, anywhere in the world.',
      },
      {
        question: 'Is there support if I get stuck?',
        answer:
          'Absolutely! You have access to our community, regular Q&A sessions, and email support.',
      },
      {
        question: 'How much time do I need to commit?',
        answer:
          'We recommend 2-3 hours per week minimum. But the program is self-paced, so you can go faster or slower.',
      },
      {
        question: 'Are there any additional costs?',
        answer:
          'No hidden fees. Your enrollment includes everything mentioned on this page.',
      },
      {
        question: 'How soon can I expect results?',
        answer:
          'Most members see initial results within the first 2 weeks. Significant transformation typically happens within 60-90 days.',
      },
      {
        question: 'Can I upgrade later?',
        answer:
          'Yes! You can upgrade to a higher tier at any time. Just pay the difference.',
      },
    ],
    contactInfo: {
      email: 'support@yourdomain.com',
      supportUrl: '/support',
      chatAvailable: true,
    },
  },

  // -------------------------------------------------------------------------
  // SECTION 18: FOOTER
  // -------------------------------------------------------------------------
  footer: {
    links: [
      { text: 'Privacy Policy', url: '/legal/privacy' },
      { text: 'Terms of Service', url: '/legal/terms' },
      { text: 'Refund Policy', url: '/legal/refunds' },
      { text: 'Contact Us', url: '/contact' },
    ],
    copyright: '© 2024 Your Company. All rights reserved.',
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/yourhandle' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/yourcompany' },
      { platform: 'Instagram', url: 'https://instagram.com/yourhandle' },
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a specific section from the sales config
 */
export function getSalesSection<K extends keyof SalesPageConfig>(
  section: K
): SalesPageConfig[K] {
  return SALES_CONFIG[section];
}

/**
 * Get the complete sales config
 */
export function getSalesConfig(): SalesPageConfig {
  return SALES_CONFIG;
}

/**
 * Calculate total bonus value
 */
export function getTotalBonusValue(): number {
  return SALES_CONFIG.bonus.bonuses.reduce((total, bonus) => {
    const value = bonus.value ? parseInt(bonus.value.replace(/\D/g, ''), 10) : 0;
    return total + value;
  }, 0);
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get days until deadline
 */
export function getDaysUntilDeadline(): number | null {
  if (!SALES_CONFIG.urgency.deadline) return null;
  const deadline = new Date(SALES_CONFIG.urgency.deadline);
  const today = new Date();
  const diff = deadline.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
