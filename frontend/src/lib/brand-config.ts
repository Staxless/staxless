import { NOTION_STYLE } from "./style-presets"

/** Interface defining the structure of a brand style configuration */
export interface BrandStyle {
  /** Name of the style preset */
  name: string
  /** Color palette for the brand */
  colors: {
    /** Primary brand color */
    primary: string
    /** Hover state for primary color */
    primaryHover: string
    /** Secondary brand color */
    secondary: string
    /** Accent color for highlights */
    accent: string
    /** Color for success states */
    success: string
    /** Color for warning states */
    warning: string
    /** Color for error states */
    error: string
    /** Gradient start color (optional) */
    gradientStart?: string
    /** Gradient middle color (optional) */
    gradientMiddle?: string
    /** Gradient end color (optional) */
    gradientEnd?: string
    /** Primary background color */
    background: string
    /** Secondary background color */
    backgroundSecondary: string
    /** Tertiary background color */
    backgroundTertiary: string
    /** Primary text color */
    textPrimary: string
    /** Secondary text color */
    textSecondary: string
    /** Muted text color */
    textMuted: string
    /** Border color */
    border: string
    /** Light border color */
    borderLight: string
  }
  /** Typography settings */
  typography: {
    /** Font family for text */
    fontFamily: string
    /** Font weight for headings */
    headingWeight: string
    /** Font weight for body text */
    bodyWeight: string
    /** Heading sizes for different levels */
    headingSize: {
      /** Size for hero headings */
      hero: string
      /** Size for h1 headings */
      h1: string
      /** Size for h2 headings */
      h2: string
      /** Size for h3 headings */
      h3: string
    }
  }
  /** Spacing settings */
  spacing: {
    /** Padding for sections */
    section: string
    /** Container max-width and padding */
    container: string
    /** Padding for cards */
    cardPadding: string
  }
  /** Visual effect settings */
  effects: {
    /** Border radius for elements */
    borderRadius: string
    /** Shadow style */
    shadow: string
    /** Blur effect for backgrounds */
    blur: string
    /** Gradient effect (optional) */
    gradient?: string
    /** Enable glassmorphism effect */
    glassmorphism: boolean
    /** Enable animations */
    animations: boolean
  }
}

/** Placeholder custom style configuration */
export const CUSTOM_STYLE: BrandStyle = {
  name: "custom",
  colors: {
    primary: "#000000",
    primaryHover: "#000000",
    secondary: "#000000",
    accent: "#000000",
    success: "#000000",
    warning: "#000000",
    error: "#000000",
    background: "#000000",
    backgroundSecondary: "#000000",
    backgroundTertiary: "#000000",
    textPrimary: "#000000",
    textSecondary: "#000000",
    textMuted: "#000000",
    border: "#000000",
    borderLight: "#000000",
  },
  typography: {
    fontFamily: "system-ui",
    headingWeight: "font-normal",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-4xl",
      h1: "text-3xl",
      h2: "text-2xl",
      h3: "text-xl",
    },
  },
  spacing: {
    section: "py-12",
    container: "max-w-6xl mx-auto px-4",
    cardPadding: "p-4",
  },
  effects: {
    borderRadius: "rounded-none",
    shadow: "shadow-none",
    blur: "backdrop-blur-none",
    glassmorphism: false,
    animations: false,
  },
}

/** Active style selection to switch between design presets */
export const ACTIVE_STYLE: BrandStyle = NOTION_STYLE

/** Company configuration (style-independent) */
export const COMPANY_CONFIG = {
  /** Company name */
  name: "Staxless",
  /** Company tagline */
  tagline: "Launch Your Vision to the Stars",
  /** Company description */
  description: "A complete platform to build and scale your SaaS with speed, security, and style.",
  /** Company website URL */
  website: "https://cosmicsaas.com",
  /** Support email address */
  email: "support@cosmicsaas.com",
  /** Support phone number */
  phone: "+1 (555) 987-6543",
  /** Company address */
  address: "456 Stellar Ave, Galaxy City, State 67890",
}

/** Content configuration for website sections (style-independent) */
export const CONTENT_CONFIG = {
  /** Hero section content */
  hero: {
    title: "The first",
    titleHighlight: "all-in-one",
    titleEnd: "SaaS platform",
    subtitle:
      "Save time building your SaaS, focus on what matters, and replace several tools with one powerful platform.",
    primaryCTA: "Get started for free",
    secondaryCTA: "View Demo",
  },
  /** Features section content */
  features: {
    title: "Everything you need to build your SaaS",
    subtitle: "Powerful features to accelerate your development and growth",
    items: [
      {
        icon: "Lock",
        title: "Secure Authentication",
        description: "Robust user authentication with SSO and passwordless login.",
      },
      {
        icon: "DollarSign",
        title: "Seamless Payments",
        description: "Effortless Stripe integration for subscriptions and one-time payments.",
      },
      {
        icon: "Users",
        title: "User Dashboard",
        description: "Intuitive user management with customizable profiles.",
      },
      {
        icon: "TrendingUp",
        title: "Growth Analytics",
        description: "Real-time insights to track user behavior and optimize growth.",
      },
      {
        icon: "Rocket",
        title: "Rapid Deployment",
        description: "Launch your SaaS in hours with our pre-built components.",
      },
      {
        icon: "Sliders",
        title: "Brand Flexibility",
        description: "Fully customizable to match your unique brand identity.",
      },
    ],
  },
  /** Pricing section content */
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Choose the plan that's right for your business",
  },
  /** FAQ section content */
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about our platform",
    items: [
      {
        question: "What's included in the free tier?",
        answer: "The free tier offers core features like authentication and a basic dashboard to get you started.",
      },
      {
        question: "Can I switch plans later?",
        answer: "Upgrade or downgrade anytime, with changes applied in the next billing cycle.",
      },
      {
        question: "Are there any setup costs?",
        answer: "No setup costs. You only pay for the plan you choose.",
      },
      {
        question: "How do I cancel my plan?",
        answer: "Cancel anytime from your account settings. Access continues until the end of your billing period.",
      },
      {
        question: "What's your refund policy?",
        answer: "We offer a 14-day money-back guarantee on all paid plans. Reach out to support for help.",
      },
    ],
  },
  /** Call-to-action section content */
  cta: {
    title: "Ready to build your SaaS?",
    subtitle: "Join thousands of developers who've launched their SaaS with our platform.",
    buttonText: "Start building today",
  },
}

/** Social media configuration (style-independent) */
export const SOCIAL_CONFIG = {
  /** Twitter handle */
  twitter: "@cosmicsaas",
  /** GitHub profile URL */
  github: "https://github.com/cosmicsaas",
  /** LinkedIn company page URL */
  linkedin: "https://linkedin.com/company/cosmicsaas",
  /** Discord community URL */
  discord: "https://discord.gg/cosmicsaas",
}

/** Navigation configuration for main menu and footer (style-independent) */
export const NAVIGATION_CONFIG = {
  /** Main navigation items */
  main: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "/docs" },
  ],
  /** Footer navigation sections */
  footer: {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/docs/api" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms" },
      { name: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
}

/** SEO configuration (style-independent) */
export const SEO_CONFIG = {
  /** Page title for SEO */
  title: "CosmicSaaS - The All-in-One SaaS Platform",
  /** Meta description for SEO */
  description:
    "Build and scale your SaaS with authentication, payments, and analytics built-in. Launch faster with our complete platform.",
  /** SEO keywords */
  keywords: ["saas", "platform", "authentication", "payments", "analytics"],
  /** Open Graph image URL */
  ogImage: "/cosmic-og-image.png",
  /** Twitter card type */
  twitterCard: "summary_large_image",
}

/** Unified brand configuration combining all settings */
export const BRAND_CONFIG = {
  /** Active style configuration */
  style: ACTIVE_STYLE,
  /** Company information */
  company: COMPANY_CONFIG,
  /** Website content */
  content: CONTENT_CONFIG,
  /** Social media links */
  social: SOCIAL_CONFIG,
  /** Navigation settings */
  navigation: NAVIGATION_CONFIG,
  /** SEO settings */
  seo: SEO_CONFIG,
  /** Legacy brand properties for backward compatibility */
  brand: {
    /** Logo configuration */
    logo: {
      /** Logo text (first letter of company name) */
      text: COMPANY_CONFIG.name.charAt(0),
      /** Logo sizes */
      size: {
        small: 28,
        medium: 36,
        large: 52,
      },
    },
    /** Brand colors (direct access) */
    colors: ACTIVE_STYLE.colors,
    /** Font settings */
    fonts: {
      heading: ACTIVE_STYLE.typography.fontFamily,
      body: ACTIVE_STYLE.typography.fontFamily,
    },
  },
}

/** Type definition for the unified brand configuration */
export type BrandConfig = typeof BRAND_CONFIG

/** Type definition for brand colors */
export type BrandColors = BrandStyle["colors"]

/** Type definition for navigation items */
export type NavigationItem = { name: string; href: string }