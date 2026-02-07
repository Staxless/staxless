/**
 * @file Brand Configuration for Staxless
 * @description Centralized brand styling, colors, typography, and company info
 */

/** Interface defining the structure of a brand style configuration */
export interface BrandStyle {
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    gradientStart?: string;
    gradientMiddle?: string;
    gradientEnd?: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    headingWeight: string;
    bodyWeight: string;
    headingSize: {
      hero: string;
      h1: string;
      h2: string;
      h3: string;
    };
  };
  spacing: {
    section: string;
    container: string;
    cardPadding: string;
  };
  effects: {
    borderRadius: string;
    shadow: string;
    blur: string;
    gradient?: string;
    glassmorphism: boolean;
    animations: boolean;
  };
}

/** Staxless brand style - Light mode with indigo/purple/cyan gradient */
export const STAXLESS_STYLE: BrandStyle = {
  name: 'staxless',
  colors: {
    // Primary brand colors
    primary: '#6366F1',       // Indigo - main brand color, buttons, links
    primaryHover: '#4F46E5',  // Darker indigo for hover states
    secondary: '#8B5CF6',     // Purple - secondary actions, gradients
    accent: '#22D3EE',        // Cyan - highlights, gradient endpoints

    // State colors
    success: '#10B981',       // Emerald - success states
    warning: '#F59E0B',       // Amber - warning states
    error: '#EF4444',         // Red - error states

    // Gradient colors
    gradientStart: '#6366F1', // Indigo
    gradientMiddle: '#8B5CF6', // Purple
    gradientEnd: '#22D3EE',   // Cyan

    // Light mode backgrounds
    background: '#FFFFFF',           // White - page background
    backgroundSecondary: '#F8FAFC',  // Slate 50 - card backgrounds, sections
    backgroundTertiary: '#F1F5F9',   // Slate 100 - inputs, elevated elements

    // Light mode text
    textPrimary: '#0F172A',    // Slate 900 - headings, body text
    textSecondary: '#64748B',  // Slate 500 - muted text, descriptions
    textMuted: '#94A3B8',      // Slate 400 - placeholder text

    // Borders
    border: '#E2E8F0',         // Slate 200 - borders
    borderLight: '#F1F5F9',    // Slate 100 - lighter borders
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: '"Cabinet Grotesk", system-ui, sans-serif',
    headingWeight: 'font-bold',
    bodyWeight: 'font-normal',
    headingSize: {
      hero: 'text-5xl md:text-6xl',
      h1: 'text-4xl md:text-5xl',
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
    },
  },
  spacing: {
    section: 'py-16 md:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    cardPadding: 'p-6 md:p-8',
  },
  effects: {
    borderRadius: 'rounded-2xl',
    shadow: 'shadow-lg',
    blur: 'backdrop-blur-sm',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400',
    glassmorphism: false,
    animations: true,
  },
};

/** Active style selection */
export const ACTIVE_STYLE: BrandStyle = STAXLESS_STYLE;

/** Company configuration */
export const COMPANY_CONFIG = {
  name: 'Staxless',
  tagline: 'Build Simple. Scale Smart. Stay Secure.',
  description: 'The production-ready microservice SaaS boilerplate that lets you launch in under 2 weeks—without the tech debt that kills momentum when traction hits.',
  website: 'https://staxless.com',
  email: 'zach@staxless.com',
  phone: '',
  address: '',
  founder: {
    name: 'Zach',
    fullName: 'Zachary Benson',
    title: 'Founder',
  },
};

/** Content configuration for website sections */
export const CONTENT_CONFIG = {
  hero: {
    title: 'Stop Fighting Your Infrastructure.',
    titleHighlight: 'Start Shipping Your Product.',
    titleEnd: '',
    subtitle: 'The production-ready microservice SaaS foundation that lets you launch in under 2 weeks—without the tech debt that kills momentum when traction hits.',
    primaryCTA: 'Get Staxless',
    secondaryCTA: 'See How It Works',
  },
  features: {
    title: 'Everything You Need to Launch and Scale',
    subtitle: 'A complete foundation with auth, payments, email, and API gateway—all wired up and production-ready.',
    items: [
      {
        id: 'microservices',
        icon: 'Boxes',
        title: '6 Pre-Wired Microservices',
        description: 'Auth, User, Payments, Email, Frontend, and API Gateway—already built, connected, and production-ready.',
      },
      {
        id: 'cli',
        icon: 'Terminal',
        title: 'Powerful CLI Tool',
        description: '15+ commands for init, dev, deploy, and service generation. One command to start, one command to deploy.',
      },
      {
        id: 'kafka',
        icon: 'Zap',
        title: 'Kafka Event Bus',
        description: 'Services communicate asynchronously out of the box. Scale independently without rewriting anything.',
      },
      {
        id: 'kong',
        icon: 'Shield',
        title: 'Kong API Gateway',
        description: 'Pre-configured routing, rate limiting, and RBAC. Production-grade security from day one.',
      },
      {
        id: 'components',
        icon: 'Layout',
        title: '40+ UI Components',
        description: 'Landing pages, auth flows, dashboard, checkout—all ready to customize with Tailwind and shadcn/ui.',
      },
      {
        id: 'docs',
        icon: 'BookOpen',
        title: '14 Task-Based Tutorials',
        description: 'Learn by doing what you actually need to do. Add pages, protect routes, integrate Stripe, and more.',
      },
    ],
  },
  pricing: {
    title: 'Choose Your Path',
    subtitle: 'One-time purchase. Lifetime access to the code. No subscriptions.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Got questions? We\'ve got answers.',
    items: [
      {
        id: 'faq1',
        question: 'I\'ve never worked with microservices before. Is this too advanced?',
        answer: 'If you can run npm install and use Docker, you can use Staxless. The CLI abstracts all the complexity. You don\'t need to understand Kafka or Kong to benefit from them.',
      },
      {
        id: 'faq2',
        question: 'What\'s the tech stack?',
        answer: 'Next.js 15, React 19, Express, MongoDB, Kafka, Kong, Stripe, Mailgun, Docker, Terraform. All modern, all production-tested.',
      },
    ],
  },
  cta: {
    title: 'Ready to Build Your Foundation?',
    subtitle: 'Skip the tech debt. Own your stack. Ship your product.',
    buttonText: 'Get Staxless',
  },
};

/** Social media configuration */
export const SOCIAL_CONFIG = {
  twitter: '@zachbenson817',
  github: 'https://github.com/staxless',
  linkedin: '',
  discord: '',
};

/** Navigation configuration */
export const NAVIGATION_CONFIG = {
  main: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: 'https://github.com/staxless/staxless-docs' },
  ],
  footer: {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '/docs' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: 'mailto:zach@staxless.com' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/legal/privacy' },
      { name: 'Terms of Service', href: '/legal/terms' },
    ],
  },
};

/** SEO configuration */
export const SEO_CONFIG = {
  title: 'Staxless - Build Simple. Scale Smart. Stay Secure.',
  description: 'The production-ready microservice SaaS boilerplate that lets you launch in under 2 weeks. Auth, payments, email, and API gateway—all wired up.',
  keywords: ['saas boilerplate', 'microservices', 'next.js', 'starter kit', 'indie hackers', 'solo founder'],
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
};

/** Unified brand configuration */
export const BRAND_CONFIG = {
  style: ACTIVE_STYLE,
  company: COMPANY_CONFIG,
  content: CONTENT_CONFIG,
  social: SOCIAL_CONFIG,
  navigation: NAVIGATION_CONFIG,
  seo: SEO_CONFIG,
  brand: {
    logo: {
      text: 'S',
      src: '/logo.png',
      size: {
        small: 24,
        medium: 32,
        large: 48,
      },
    },
    colors: ACTIVE_STYLE.colors,
    fonts: {
      heading: ACTIVE_STYLE.typography.headingFont,
      body: ACTIVE_STYLE.typography.fontFamily,
    },
  },
};

export type BrandConfig = typeof BRAND_CONFIG;
export type BrandColors = BrandStyle['colors'];
export type NavigationItem = { name: string; href: string };
