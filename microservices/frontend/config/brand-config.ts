// 

/** Interface defining the structure of a brand style configuration */
export interface BrandStyle {
  /** Name of the style preset */
  name: string;
  /** Color palette for the brand */
  colors: {
    /** Primary brand color */
    primary: string;
    /** Hover state for primary color */
    primaryHover: string;
    /** Secondary brand color */
    secondary: string;
    /** Accent color for highlights */
    accent: string;
    /** Color for success states */
    success: string;
    /** Color for warning states */
    warning: string;
    /** Color for error states */
    error: string;
    /** Gradient start color (optional) */
    gradientStart?: string;
    /** Gradient middle color (optional) */
    gradientMiddle?: string;
    /** Gradient end color (optional) */
    gradientEnd?: string;
    /** Primary background color */
    background: string;
    /** Secondary background color */
    backgroundSecondary: string;
    /** Tertiary background color */
    backgroundTertiary: string;
    /** Primary text color */
    textPrimary: string;
    /** Secondary text color */
    textSecondary: string;
    /** Muted text color */
    textMuted: string;
    /** Border color */
    border: string;
    /** Light border color */
    borderLight: string;
  };
  /** Typography settings */
  typography: {
    /** Font family for text */
    fontFamily: string;
    /** Font weight for headings */
    headingWeight: string;
    /** Font weight for body text */
    bodyWeight: string;
    /** Heading sizes for different levels */
    headingSize: {
      /** Size for hero headings */
      hero: string;
      /** Size for h1 headings */
      h1: string;
      /** Size for h2 headings */
      h2: string;
      /** Size for h3 headings */
      h3: string;
    };
  };
  /** Spacing settings */
  spacing: {
    /** Padding for sections */
    section: string;
    /** Container max-width and padding */
    container: string;
    /** Padding for cards */
    cardPadding: string;
  };
  /** Visual effect settings */
  effects: {
    /** Border radius for elements */
    borderRadius: string;
    /** Shadow style */
    shadow: string;
    /** Blur effect for backgrounds */
    blur: string;
    /** Gradient effect (optional) */
    gradient?: string;
    /** Enable glassmorphism effect */
    glassmorphism: boolean;
    /** Enable animations */
    animations: boolean;
  };
}

/** Default style configuration with a modern dark theme */
export const CUSTOM_STYLE: BrandStyle = {
  name: 'custom',
  colors: {
    primary: '#6366F1', // Indigo - main brand color
    primaryHover: '#4F46E5', // Darker indigo for hover states
    secondary: '#8B5CF6', // Purple - secondary actions
    accent: '#22D3EE', // Cyan - highlights and accents
    success: '#10B981', // Emerald green - success states
    warning: '#F59E0B', // Amber - warning states
    error: '#EF4444', // Red - error states
    gradientStart: '#6366F1', // Gradient start (indigo)
    gradientMiddle: '#8B5CF6', // Gradient middle (purple)
    gradientEnd: '#22D3EE', // Gradient end (cyan)
    background: '#0F172A', // Slate 900 - main background
    backgroundSecondary: '#1E293B', // Slate 800 - cards/sections
    backgroundTertiary: '#334155', // Slate 700 - inputs/elevated
    textPrimary: '#F8FAFC', // Slate 50 - primary text (high contrast)
    textSecondary: '#CBD5E1', // Slate 300 - secondary text
    textMuted: '#94A3B8', // Slate 400 - muted/placeholder text
    border: '#334155', // Slate 700 - borders
    borderLight: '#475569', // Slate 600 - lighter borders
  },
  typography: {
    fontFamily: '"Cabinet Grotesk"', // system-ui, sans-serif', // Replace with your font family
    headingWeight: 'font-bold', // Replace with heading font weight
    bodyWeight: 'font-normal', // Replace with body font weight
    headingSize: {
      hero: 'text-5xl', // Replace with hero heading size
      h1: 'text-4xl', // Replace with h1 size
      h2: 'text-3xl', // Replace with h2 size
      h3: 'text-2xl', // Replace with h3 size
    },
  },
  spacing: {
    section: 'py-12', // Replace with section padding
    container: 'max-w-7xl mx-auto px-4', // Replace with container styles
    cardPadding: 'p-6', // Replace with card padding
  },
  effects: {
    borderRadius: 'rounded-md', // Replace with border radius
    shadow: 'shadow-md', // Replace with shadow style
    blur: 'backdrop-blur-sm', // Replace with blur effect
    glassmorphism: false, // Enable/disable glassmorphism
    animations: true, // Enable/disable animations
  },
};

/** Active style selection to switch between design presets */
export const ACTIVE_STYLE: BrandStyle = CUSTOM_STYLE;

/** Company configuration (style-independent) */
export const COMPANY_CONFIG = {
  /** Company name */
  name: 'YourSaaSName', // Replace with your company name
  /** Company tagline */
  tagline: 'Your Tagline Here', // Replace with your tagline
  /** Company description */
  description: 'Describe your SaaS or business here.', // Replace with your description
  /** Company website URL */
  website: 'https://yourdomain.com', // Replace with your website
  /** Support email address */
  email: 'support@yourdomain.com', // Replace with your support email
  /** Support phone number */
  phone: '+1 (555) 123-4567', // Replace with your support phone
  /** Company address */
  address: '123 Your Street, City, State 12345', // Replace with your address
};

/** Content configuration for website sections (style-independent) */
export const CONTENT_CONFIG = {
  /** Hero section content */
  hero: {
    title: 'Welcome to YourSaaSName', // Replace with hero title
    titleHighlight: 'Highlight Text', // Replace with highlighted text
    titleEnd: '', // Replace with title end (optional)
    subtitle: 'Describe what your SaaS does in one sentence.', // Replace with subtitle
    primaryCTA: 'Get Started', // Replace with primary CTA text
    secondaryCTA: 'Learn More', // Replace with secondary CTA text
  },
  /** Features section content */
  features: {
    title: 'Features of YourSaaSName', // Replace with features title
    subtitle: 'Describe the key features of your SaaS.', // Replace with features subtitle
    items: [
      {
        id: 'feature1',
        icon: 'Lock', // Replace with icon name (e.g., Lock, Star)
        title: 'Feature One', // Replace with feature title
        description: 'Describe the first feature of your SaaS.', // Replace with description
      },
      {
        id: 'feature2',
        icon: 'DollarSign', // Replace with icon name
        title: 'Feature Two', // Replace with feature title
        description: 'Describe the second feature of your SaaS.', // Replace with description
      },
      {
        id: 'feature3',
        icon: 'Users' ,// Replace with icon name
        title: 'Feature Three', // Replace with feature title
        description: 'Describe the third feature of your SaaS.', // Replace with description
      },
    ],
  },
  /** Pricing section content */
  pricing: {
    title: 'Pricing Plans', // Replace with pricing title
    subtitle: 'Choose the plan that fits your needs.', // Replace with pricing subtitle
  },
  /** FAQ section content */
  faq: {
    title: 'Frequently Asked Questions', // Replace with FAQ title
    subtitle: 'Answers to common questions about YourSaaSName.', // Replace with FAQ subtitle
    items: [
      {
        id: 'faq1',
        question: 'What does YourSaaSName do?', // Replace with question
        answer: 'Provide a brief answer to the question.', // Replace with answer
      },
      {
        id: 'faq2',
        question: 'How do I get started?', // Replace with question
        answer: 'Provide a brief answer to the question.', // Replace with answer
      },
    ],
  },
  /** Call-to-action section content */
  cta: {
    title: 'Ready to Start?', // Replace with CTA title
    subtitle: 'Join users who love YourSaaSName.', // Replace with CTA subtitle
    buttonText: 'Start Now', // Replace with CTA button text
  },
};

/** Social media configuration (style-independent) */
export const SOCIAL_CONFIG = {
  /** Twitter handle */
  twitter: '@YourSaaSName', // Replace with your Twitter handle
  /** GitHub profile URL */
  github: 'https://github.com/yourusername', // Replace with your GitHub URL
  /** LinkedIn company page URL */
  linkedin: 'https://linkedin.com/company/yourcompany', // Replace with your LinkedIn URL
  /** Discord community URL */
  discord: 'https://discord.gg/yourinvite', // Replace with your Discord URL
};

/** Navigation configuration for main menu and footer (style-independent) */
export const NAVIGATION_CONFIG = {
  /** Main navigation items */
  main: [
    { name: 'Features', href: '#features' }, // Replace with navigation item
    { name: 'Pricing', href: '#pricing' }, // Replace with navigation item
    { name: 'Docs', href: '/docs' }, // Replace with navigation item
    { name: 'Blog', href: '/blog' }, 
  ],
  /** Footer navigation sections */
  footer: {
    product: [
      { name: 'Features', href: '#features' }, // Replace with product link
      { name: 'Pricing', href: '#pricing' }, // Replace with product link
      { name: 'Documentation', href: '/docs' }, // Replace with product link
    ],
    company: [
      { name: 'About', href: '/about' }, // Replace with company link
      { name: 'Contact', href: '/contact' }, // Replace with company link
    ],
    legal: [
      { name: 'Privacy Policy', href: '/legal/privacy' }, // Replace with legal link
      { name: 'Terms of Service', href: '/legal/terms' }, // Replace with legal link
    ],
  },
};

/** SEO configuration (style-independent) */
export const SEO_CONFIG = {
  /** Page title for SEO */
  title: 'YourSaaSName - Your SaaS Description', // Replace with SEO title
  /** Meta description for SEO */
  description: 'Describe your SaaS for search engines.', // Replace with SEO description
  /** SEO keywords */
  keywords: ['your', 'saas', 'keywords'], // Replace with SEO keywords
  /** Open Graph image URL */
  ogImage: '/your-og-image.png', // Replace with Open Graph image URL
  /** Twitter card type */
  twitterCard: 'summary_large_image', // Replace with Twitter card type
};

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
      text: 'Y', // Replace with first letter of your company name
      /** Logo source */
      src: '/your-logo.png', // Replace with your logo path
      /** Logo sizes */
      size: {
        small: 24, // Replace with small logo size
        medium: 32, // Replace with medium logo size
        large: 48, // Replace with large logo size
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
};

/** Type definition for the unified brand configuration */
export type BrandConfig = typeof BRAND_CONFIG;

/** Type definition for brand colors */
export type BrandColors = BrandStyle['colors'];

/** Type definition for navigation items */
export type NavigationItem = { name: string; href: string };