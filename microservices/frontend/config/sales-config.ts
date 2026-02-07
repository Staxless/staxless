/**
 * @file Sales Page Configuration for Staxless
 * @description All copy and content for the sales/landing page.
 * Edit this file to customize all text, features, testimonials, etc.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroSection {
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  techStack?: string[];
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
  beforePoints: { label: string; text: string }[];
  afterPoints: { label: string; text: string }[];
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
    commits?: number;
    monthsBuilding?: number;
    achievements?: string[];
  };
  secretIngredient: string;
  drumrollText: string;
}

export interface SolutionSection {
  offerIntro: string;
  offerName: string;
  tagline: string;
  description: string;
  cliCommands: { command: string; description: string }[];
  keyBenefits: string[];
  productImage?: string;
}

export interface Feature {
  headline: string;
  description: string;
  icon?: string;
  benefit: string;
  category?: string;
}

export interface FeaturesSection {
  headline: string;
  subheadline: string;
  categories: {
    name: string;
    emoji?: string;
    features: Feature[];
  }[];
}

export interface OutcomesSection {
  headline: string;
  outcomes: { number: string; title: string; description: string }[];
  closingStatement: string;
}

export interface Differentiator {
  title: string;
  description: string;
  icon?: string;
}

export interface ReassuranceSection {
  headline: string;
  subheadline: string;
  differentiators: Differentiator[];
  closingStatement: string;
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
  placeholderNote?: string;
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
  codeExample?: string;
  bonusDescription: string;
  bonuses?: Bonus[];
}

export interface UrgencySection {
  type: 'limited-time' | 'limited-spots' | 'bonus-expiration' | 'none';
  headline: string;
  description: string;
  deadline?: string;
  spotsAvailable?: number;
  bonusNote?: string;
  ctaText?: string;
}

export interface VisualPreview {
  title: string;
  description?: string;
  image: string;
  alt: string;
}

export interface WhatsInsideSection {
  headline: string;
  subheadline: string;
  visualPreviews: VisualPreview[];
  credibilityNote?: string;
}

export interface PricingPackage {
  name: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  price: number;
  originalPrice?: number;
  popular?: boolean;
  ctaText: string;
  productId?: string;
  bonusNote?: string;
}

export interface PurchasePitchSection {
  headline: string;
  subheadline: string;
  packages: PricingPackage[];
  paymentMethods?: string[];
  guaranteeText?: string;
  reminderText: string;
}

export interface CaseStudy {
  name: string;
  role?: string;
  quote: string;
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
  closingStatement: string;
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
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
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
// SALES PAGE CONFIGURATION - STAXLESS
// ============================================================================

export const SALES_CONFIG: SalesPageConfig = {
  // -------------------------------------------------------------------------
  // SECTION 1: THE HERO HOOK
  // -------------------------------------------------------------------------
  hero: {
    headline: 'Stop Fighting Your Infrastructure.',
    headlineHighlight: 'Start Shipping Your Product.',
    subheadline:
      'The production-ready microservice SaaS foundation that lets you launch in under 2 weeks—without the tech debt that kills momentum when traction hits.',
    techStack: ['Next.js 15', 'Express', 'MongoDB', 'Kafka', 'Kong', 'Stripe', 'Docker'],
    ctaText: 'Get Staxless →',
    ctaUrl: '#pricing',
    secondaryCtaText: 'See How It Works',
    secondaryCtaUrl: '#whats-inside',
    heroImage: '/images/hero-cli.png',
  },

  // -------------------------------------------------------------------------
  // SECTION 2: ADDRESSING THE CURRENT REALITY
  // -------------------------------------------------------------------------
  currentReality: {
    headline: 'Sound familiar?',
    introText:
      'You started building your SaaS with the best intentions. "I\'ll keep it simple for now. I can always refactor later." Fast forward a few months. Your MVP is working. Users are signing up. Traction is happening. And then it hits you.',
    painPoints: [
      'You\'re spending nights and weekends on infrastructure instead of talking to customers',
      'Every new feature feels like pulling teeth because everything is tangled together',
      'You\'re worried about what happens when you actually scale—because you\'ve seen what replatforming looks like',
      'You\'re using a boilerplate that got you to day one but now feels like a straitjacket',
      'You\'re building plumbing when you should be building your product',
    ],
    empathyStatement:
      'The cruel irony? You\'re being punished for success you haven\'t even had yet.',
    transitionText:
      'You know you should\'ve built it "the right way" from the start. But microservices felt like overkill. Too complex. Too much infrastructure to manage. So you made the practical choice. Ship now, deal with it later. Later is here. And it\'s expensive.',
  },

  // -------------------------------------------------------------------------
  // SECTION 3: THE TRANSFORMATION
  // -------------------------------------------------------------------------
  transformation: {
    headline: 'What if your MVP was already built to scale?',
    visionStatement: 'Imagine a different path.',
    beforePoints: [
      { label: 'Before', text: 'Burning nights on infrastructure' },
      { label: 'Before', text: 'Tech debt anxiety with every feature' },
      { label: 'Before', text: 'Locked into a monolith that doesn\'t scale' },
      { label: 'Before', text: 'Worried about vendor lock-in' },
      { label: 'Before', text: 'Context-switching between auth, payments, DevOps' },
      { label: 'Before', text: 'Dreading the replatforming conversation' },
    ],
    afterPoints: [
      { label: 'After', text: 'Closing your laptop at 6pm' },
      { label: 'After', text: 'Architecture that just handles growth' },
      { label: 'After', text: 'Modular services you can deploy independently' },
      { label: 'After', text: 'Owning your entire stack' },
      { label: 'After', text: 'Focusing on what makes your product unique' },
      { label: 'After', text: 'Never having that conversation' },
    ],
    closingStatement:
      'You\'re no longer fighting your infrastructure. You own a foundation that scales with you—so you can focus on your product, your customers, and getting home for dinner.',
  },

  // -------------------------------------------------------------------------
  // SECTION 4: ESTABLISH TRUST & THE DRUMROLL
  // -------------------------------------------------------------------------
  trust: {
    headline: 'Hey, I\'m Zach.',
    founderName: 'Zach',
    founderImage: '/public/zach.jpeg',
    founderTitle: 'Solo Founder',
    introduction: 'I\'m a solo founder, just like you.',
    backstory: [
      'Over the past few years, I\'ve set up the same SaaS infrastructure more times than I can count. Auth systems. Payment integrations. Email services. API gateways. The whole stack.',
      'Every time, I told myself: "This time I\'ll do it right."',
      'And every time, I hit the same wall. Either I shipped fast with a monolith and paid for it later—or I went full microservices too early and drowned in complexity before I\'d even validated my idea.',
      'There had to be a middle path.',
    ],
    pivotalMoment: 'So I built it.',
    credibility: {
      commits: 225,
      monthsBuilding: 18,
      achievements: [
        'Battle-tested from real founder pain',
        'Production-ready infrastructure',
        'Built by a solo founder for solo founders',
      ],
    },
    secretIngredient: 'The Middle Path Architecture',
    drumrollText: 'I call it Staxless.',
  },

  // -------------------------------------------------------------------------
  // SECTION 5: THE SOLUTION/YOUR OFFER
  // -------------------------------------------------------------------------
  solution: {
    offerIntro: 'Introducing',
    offerName: 'Staxless',
    tagline: 'The Microservice SaaS Boilerplate That Actually Makes Sense',
    description:
      'Staxless is a production-ready foundation for your SaaS—with auth, payments, email, and API gateway already wired up and working together. But here\'s what makes it different: It\'s built on microservices from day one—without the microservice complexity.',
    cliCommands: [
      { command: 'staxless init', description: 'Set up your project' },
      { command: 'staxless dev start', description: 'All services running, one command' },
      { command: 'staxless prod deploy', description: 'Ship to production' },
    ],
    keyBenefits: [
      'Independent, scalable services that communicate via Kafka',
      'Route through Kong API gateway with RBAC',
      'No Docker juggling. No terminal chaos. No Kafka tutorials.',
    ],
    productImage: '/images/product-mockup.png',
  },

  // -------------------------------------------------------------------------
  // SECTION 6: FEATURES AND BENEFITS
  // -------------------------------------------------------------------------
  features: {
    headline: 'Everything You Need to Launch and Scale',
    subheadline: 'A complete foundation with auth, payments, email, and API gateway—all wired up and production-ready.',
    categories: [
      {
        name: 'Core Infrastructure',
        emoji: '🏗️',
        features: [
          {
            headline: '6 Pre-Wired Microservices',
            description: 'Auth, User, Payments, Email, Frontend, API Gateway—already built, connected, and production-ready.',
            icon: 'Boxes',
            benefit: 'Weeks saved — Skip the integration grind and start building your actual product',
          },
          {
            headline: 'Kafka Event Bus',
            description: 'Services communicate asynchronously out of the box.',
            icon: 'Zap',
            benefit: 'Future-proof architecture — Scale independently without rewriting anything',
          },
          {
            headline: 'Kong API Gateway with RBAC',
            description: 'Pre-configured routing, rate limiting, and role-based access control.',
            icon: 'Shield',
            benefit: 'Built-in security — Production-grade protection without becoming a security expert',
          },
        ],
      },
      {
        name: 'Developer Experience',
        emoji: '🛠️',
        features: [
          {
            headline: 'CLI Tool',
            description: '15+ commands for init, dev, deploy, and service generation.',
            icon: 'Terminal',
            benefit: 'Mental clarity — One command, all services running, no terminal chaos',
          },
          {
            headline: 'Service Generator',
            description: 'staxless generate service my-service scaffolds new microservices.',
            icon: 'Plus',
            benefit: 'Effortless scaling — Add new microservices as you grow, already wired to Kafka',
          },
          {
            headline: 'One-Command Deploy',
            description: 'staxless prod deploy to Docker Swarm.',
            icon: 'Rocket',
            benefit: 'Ship faster — Deploy confidently without a DevOps background',
          },
        ],
      },
      {
        name: 'Frontend & UI',
        emoji: '🎨',
        features: [
          {
            headline: 'Next.js 15 + React 19 Frontend',
            description: 'Modern stack with App Router, ready to customize.',
            icon: 'Layout',
            benefit: 'Start current — No legacy code to work around',
          },
          {
            headline: '40+ Pre-Built UI Components',
            description: 'Landing pages, auth flows, dashboard, checkout—all ready.',
            icon: 'Grid',
            benefit: 'Faster launch — Stop rebuilding common UI, focus on what\'s unique',
          },
          {
            headline: 'Tailwind + shadcn/ui',
            description: 'Beautiful defaults, easy to customize.',
            icon: 'Paintbrush',
            benefit: 'Look professional — Ship something you\'re proud of from day one',
          },
        ],
      },
      {
        name: 'Documentation & Support',
        emoji: '📚',
        features: [
          {
            headline: '14 Task-Based Tutorials',
            description: '"Add a Page," "Add Stripe Plan," "Add OAuth Provider"—action-oriented guides.',
            icon: 'BookOpen',
            benefit: 'Learn by doing — Get answers for what you\'re actually trying to build',
          },
          {
            headline: 'CLI Reference',
            description: 'Every command documented with examples.',
            icon: 'FileText',
            benefit: 'Quick answers — Stay in flow instead of hunting for docs',
          },
          {
            headline: 'Troubleshooting Guides',
            description: 'Common issues and fixes for Docker, auth, payments, deployment.',
            icon: 'Wrench',
            benefit: 'Stay unblocked — Fix problems yourself at 11pm',
          },
        ],
      },
      {
        name: 'Ownership & Infrastructure',
        emoji: '🔐',
        features: [
          {
            headline: 'Fully Self-Hostable',
            description: 'No vendor dependencies required.',
            icon: 'Server',
            benefit: 'True ownership — No lock-in, no surprise price hikes, no sunset notices',
          },
          {
            headline: 'Terraform Templates',
            description: 'Pre-configured AWS infrastructure.',
            icon: 'Cloud',
            benefit: 'Pro-grade infra — Production setup without becoming a DevOps engineer',
          },
          {
            headline: 'GitHub Actions CI/CD',
            description: 'Automated testing and deployment pipelines.',
            icon: 'GitBranch',
            benefit: 'Automated quality — Ship with confidence',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 7: THE OUTCOMES
  // -------------------------------------------------------------------------
  outcomes: {
    headline: 'What Actually Happens When You Use Staxless',
    outcomes: [
      {
        number: '1',
        title: 'You launch faster.',
        description: 'Go from zero to production-ready in under 2 weeks—not 2 months.',
      },
      {
        number: '2',
        title: 'You scale without drama.',
        description: 'When traction hits, you add services. No emergency rewrites. No 3am replatforming conversations.',
      },
      {
        number: '3',
        title: 'You focus on what matters.',
        description: 'Customers. Product. Growth. Not infrastructure firefighting.',
      },
      {
        number: '4',
        title: 'You own your future.',
        description: 'Self-hostable. No vendor lock-in. Your stack, your rules.',
      },
      {
        number: '5',
        title: 'You get time back.',
        description: 'Close your laptop at a reasonable hour. Be present for your family. Build meaningfully, not frantically.',
      },
    ],
    closingStatement: '',
  },

  // -------------------------------------------------------------------------
  // SECTION 8: THE REASSURANCE
  // -------------------------------------------------------------------------
  reassurance: {
    headline: 'Why Staxless Actually Works',
    subheadline:
      'Most SaaS boilerplates give you a head start on day one—then become a bottleneck on day 100. Staxless is different.',
    differentiators: [
      {
        title: 'Microservices Without the Migraine',
        description:
          'Other boilerplates are monolithic. Fast to start, painful to scale. Staxless gives you modular, independently deployable services from day one—but the CLI abstracts all the complexity. You don\'t need to understand Kafka to use it.',
        icon: 'Target',
      },
      {
        title: 'A CLI That Actually Helps',
        description:
          'staxless dev start spins up six services with one command. staxless generate service scaffolds a new microservice in 30 seconds. staxless prod deploy ships to production. No Docker juggling. No terminal chaos.',
        icon: 'Terminal',
      },
      {
        title: 'You Own Everything',
        description:
          'No managed service dependencies. No vendor lock-in. Self-host on your own infrastructure. When you buy Staxless, you get the code—forever.',
        icon: 'Key',
      },
    ],
    closingStatement:
      'This isn\'t a shortcut that creates future problems. It\'s a foundation that eliminates them.',
  },

  // -------------------------------------------------------------------------
  // SECTION 9: SOCIAL PROOF AND TESTIMONIALS
  // -------------------------------------------------------------------------
  socialProof: {
    headline: 'What Founders Are Saying',
    subheadline: 'Real results from founders who took the leap.',
    placeholderNote: '(Testimonials will be populated from beta testers)',
    testimonials: [
      {
        name: 'Beta Tester',
        role: 'Indie Founder',
        company: 'SaaS Product',
        quote:
          'I was spending all my time on infrastructure instead of my product. With Staxless, I had auth, payments, and email working in a weekend. Now I\'m actually talking to customers instead of debugging Docker.',
        result: 'Launched in 2 weeks',
        rating: 5,
      },
      {
        name: 'Beta Tester',
        role: 'Solo Founder',
        quote:
          'I\'ve tried other boilerplates. They get you to day one, then you\'re on your own. Staxless is the first one that actually feels like it scales with you.',
        result: 'Scaled without replatforming',
        rating: 5,
      },
      {
        name: 'Beta Tester',
        role: 'Technical Founder',
        quote:
          'The service generator is magic. I added a notifications service in 30 seconds and it was already wired to Kafka. That would\'ve taken me a week to figure out on my own.',
        result: 'Added 3 services in one day',
        rating: 5,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 10: BUT WAIT, THERE'S MORE! (CANDY FEATURE)
  // -------------------------------------------------------------------------
  bonus: {
    headline: 'Plus: The Feature That Makes Founders Say "Whoa"',
    subheadline: 'Service Generator',
    codeExample: 'staxless generate service notifications',
    bonusDescription:
      'Most boilerplates are static. You get what you get. Staxless grows with you. When you need a new service—notifications, webhooks, reporting, whatever—you don\'t start from scratch. One command. New microservice. Kafka integration already wired. Ready to build. This is what "scales with you" actually means.',
  },

  // -------------------------------------------------------------------------
  // SECTION 11: WHY BUY NOW?
  // -------------------------------------------------------------------------
  urgency: {
    type: 'limited-time',
    headline: 'Launch Pricing Ends May 3rd',
    description:
      'Right now, you can get Staxless at launch pricing. This pricing is available during the launch window only. After May 3rd, prices go back to normal.',
    deadline: '2026-05-03',
    bonusNote:
      'Pro tier buyers this week get a bonus 30-minute architecture strategy call with me. (Limited to first 10 purchases.)',
    ctaText: 'Lock In Launch Pricing',
  },

  // -------------------------------------------------------------------------
  // SECTION 12: WHAT'S INSIDE
  // -------------------------------------------------------------------------
  whatsInside: {
    headline: 'See What You\'re Getting',
    subheadline: 'This isn\'t a weekend project. It\'s 18 months of real development, battle-tested and production-ready.',
    visualPreviews: [
      {
        title: 'The CLI in Action',
        description: 'staxless init walkthrough',
        image: '/images/preview-cli.png',
        alt: 'CLI screenshot showing staxless init',
      },
      {
        title: 'The Dashboard',
        description: 'User management and settings',
        image: '/images/preview-dashboard.png',
        alt: 'Dashboard interface',
      },
      {
        title: 'Landing Page Components',
        description: 'Hero, features, pricing sections',
        image: '/images/preview-landing.png',
        alt: 'Landing page components',
      },
      {
        title: 'The Documentation',
        description: 'Task-based tutorials',
        image: '/images/preview-docs.png',
        alt: 'Documentation interface',
      },
      {
        title: 'Service Generator',
        description: 'One command, new microservice',
        image: '/images/preview-generator.png',
        alt: 'Service generator in action',
      },
    ],
    credibilityNote: '18 months of development. 225+ commits. Built from real founder pain.',
  },

  // -------------------------------------------------------------------------
  // SECTION 13: PURCHASE PITCH
  // -------------------------------------------------------------------------
  purchasePitch: {
    headline: 'Get Staxless',
    subheadline: 'One-time purchase. Lifetime access to the code. No subscriptions.',
    packages: [
      {
        name: 'Staxless',
        description: 'Everything you need to launch and scale',
        features: [
          'Full boilerplate (6 microservices)',
          'CLI tool with service generator',
          'Documentation + 14 tutorials',
          '40+ UI components',
          'GitHub Actions CI/CD',
          'Terraform infrastructure templates',
          'Private GitHub repo access',
          'Lifetime updates',
        ],
        price: 249,
        originalPrice: 349,
        popular: true,
        ctaText: 'Get Staxless →',
        productId: 'prod_staxless',
      },
    ],
    reminderText: 'One-time purchase. Lifetime access to the code. No subscriptions.',
  },

  // -------------------------------------------------------------------------
  // SECTION 14: MORE TESTIMONIALS
  // -------------------------------------------------------------------------
  caseStudies: {
    headline: 'Still on the Fence?',
    subheadline: 'Here\'s one more from a founder who\'s been there.',
    studies: [
      {
        name: 'Beta Tester',
        role: 'Founder',
        quote:
          'I\'ve been burned by boilerplates before. They promise the world and deliver a mess of code you can\'t actually work with. Staxless is different—it\'s opinionated in the right ways and flexible where it matters. I finally feel like I have a foundation I can trust.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION 15: WHY IT'S DIFFERENT
  // -------------------------------------------------------------------------
  whyDifferent: {
    headline: 'How Staxless Compares',
    subheadline: 'Not just another boilerplate.',
    comparisons: [
      {
        aspect: 'Architecture',
        otherSolutions: 'Monolithic',
        yourSolution: 'Microservices from day one',
      },
      {
        aspect: 'Scaling',
        otherSolutions: 'Replatform when you grow',
        yourSolution: 'Add services as you need them',
      },
      {
        aspect: 'CLI',
        otherSolutions: 'Basic or none',
        yourSolution: '15+ commands, full workflow',
      },
      {
        aspect: 'Service generation',
        otherSolutions: 'Not available',
        yourSolution: 'One command, wired to Kafka',
      },
      {
        aspect: 'Deployment',
        otherSolutions: 'DIY',
        yourSolution: 'staxless prod deploy',
      },
      {
        aspect: 'Vendor lock-in',
        otherSolutions: 'Often tied to managed services',
        yourSolution: 'Fully self-hostable',
      },
    ],
    closingStatement:
      'Most boilerplates optimize for day one. Staxless optimizes for day one AND day 1,000.',
  },

  // -------------------------------------------------------------------------
  // SECTION 16: WHO IT'S RIGHT FOR
  // -------------------------------------------------------------------------
  whoItsFor: {
    headline: 'Is Staxless Right for You?',
    subheadline: 'Let\'s make sure this is a fit.',
    rightFor: [
      'You\'re a solo founder or small team building a SaaS product',
      'You\'re comfortable with Node.js, Docker, and command-line tools',
      'You want to ship fast without creating tech debt that bites you later',
      'You value owning your infrastructure over depending on managed services',
      'You\'ve been burned by shortcuts before and want to do it right this time',
      'You want to focus on your product, not your plumbing',
    ],
    notRightFor: [
      'You\'re a complete beginner who\'s never written code before',
      'You want a no-code solution',
      'You\'re looking for something built on Python, Ruby, or a stack other than Node.js/Next.js',
      'You need enterprise support with SLAs and guaranteed response times',
      'You want someone else to manage your infrastructure for you',
    ],
    closingStatement:
      'Staxless is built for pragmatic builders who want speed AND quality. If that\'s you, you\'re in the right place.',
  },

  // -------------------------------------------------------------------------
  // SECTION 17: FAQ/CONTACT
  // -------------------------------------------------------------------------
  faq: {
    headline: 'Frequently Asked Questions',
    subheadline: 'Got questions? We\'ve got answers.',
    questions: [
      {
        question: 'I\'ve never worked with microservices before. Is this too advanced for me?',
        answer:
          'If you can run npm install and use Docker, you can use Staxless. The CLI abstracts all the complexity. You don\'t need to understand Kafka or Kong to benefit from them—the tooling handles it.',
      },
      {
        question: 'What if I get stuck?',
        answer:
          'Pro tier includes direct email support from me. Plus there\'s comprehensive documentation, 14 tutorials, and a community of founders who\'ve built with Staxless. You won\'t be left hanging.',
      },
      {
        question: 'Can I use this for multiple projects?',
        answer:
          'Yes. Your license covers unlimited personal/business projects. Build as many SaaS products as you want.',
      },
      {
        question: 'What\'s the tech stack?',
        answer:
          'Next.js 15, React 19, Express, MongoDB, Kafka, Kong, Stripe, Mailgun, Docker, Terraform. All modern, all production-tested.',
      },
      {
        question: 'Is this a subscription?',
        answer:
          'No. One-time purchase. You get the code forever. Pro tier includes lifetime updates, but you can keep using what you have indefinitely.',
      },
      {
        question: 'What if it\'s not for me?',
        answer:
          'I want you to succeed with Staxless. If you run into issues, reach out and I\'ll do my best to help. That said, due to the nature of digital code products, I don\'t offer refunds—so make sure it\'s a fit before you buy.',
      },
      {
        question: 'I have another question.',
        answer:
          'Email me at zach@staxless.com and I\'ll get back to you personally.',
      },
    ],
    contactInfo: {
      email: 'zach@staxless.com',
      supportUrl: 'mailto:zach@staxless.com',
      chatAvailable: false,
    },
  },

  // -------------------------------------------------------------------------
  // SECTION 18: FOOTER CTA
  // -------------------------------------------------------------------------
  footer: {
    headline: 'Ready to Build Your Foundation?',
    subheadline: 'Skip the tech debt. Own your stack. Ship your product.',
    ctaText: 'Get Staxless',
    ctaUrl: '#pricing',
    links: [
      { text: 'Privacy Policy', url: '/legal/privacy' },
      { text: 'Terms of Service', url: '/legal/terms' },
      { text: 'Contact', url: 'mailto:zach@staxless.com' },
    ],
    copyright: '© 2026 Staxless. All rights reserved.',
    socialMedia: [
      { platform: 'Twitter', url: 'https://x.com/zachbenson827' },
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getSalesSection<K extends keyof SalesPageConfig>(
  section: K
): SalesPageConfig[K] {
  return SALES_CONFIG[section];
}

export function getSalesConfig(): SalesPageConfig {
  return SALES_CONFIG;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDaysUntilDeadline(): number | null {
  if (!SALES_CONFIG.urgency.deadline) return null;
  const deadline = new Date(SALES_CONFIG.urgency.deadline);
  const today = new Date();
  const diff = deadline.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
