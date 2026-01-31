import { BRAND_CONFIG, type BrandStyle, CUSTOM_STYLE } from '@config/brand-config';
import { AVAILABLE_STYLES } from './style-presets';

/**
 * Creates a custom style by merging a base style with overrides
 * @param baseStyle - The base style to extend
 * @param overrides - Partial style overrides to apply
 * @returns A new BrandStyle object with merged properties
 */
export function createCustomStyle(
  baseStyle: BrandStyle,
  overrides: Partial<BrandStyle>
): BrandStyle {
  return {
    ...baseStyle,
    ...overrides,
    colors: { ...baseStyle.colors, ...overrides.colors },
    typography: { ...baseStyle.typography, ...overrides.typography },
    spacing: { ...baseStyle.spacing, ...overrides.spacing },
    effects: { ...baseStyle.effects, ...overrides.effects },
  };
}

/**
 * Generates CSS variables from a brand style
 * @param style - The brand style to generate variables from (defaults to active style)
 * @returns An object containing CSS variable key-value pairs
 */
export function generateCSSVariables(style: BrandStyle = BRAND_CONFIG.style) {
  const { colors } = style;
  return {
    '--brand-primary': colors.primary,
    '--brand-primary-hover': colors.primaryHover,
    '--brand-secondary': colors.secondary,
    '--brand-accent': colors.accent,
    '--brand-success': colors.success,
    '--brand-warning': colors.warning,
    '--brand-error': colors.error,
    '--brand-gradient-start': colors.gradientStart || colors.primary,
    '--brand-gradient-middle': colors.gradientMiddle || colors.secondary,
    '--brand-gradient-end': colors.gradientEnd || colors.accent,
    '--brand-background': colors.background,
    '--brand-background-secondary': colors.backgroundSecondary,
    '--brand-background-tertiary': colors.backgroundTertiary,
    '--brand-text-primary': colors.textPrimary,
    '--brand-text-secondary': colors.textSecondary,
    '--brand-text-muted': colors.textMuted,
    '--brand-border': colors.border,
    '--brand-border-light': colors.borderLight,
  };
}

/**
 * Switches to a named style preset
 * @param styleName - The name of the style to switch to
 * @returns The selected BrandStyle or CUSTOM_STYLE as fallback
 */
export function switchToStyle(styleName: string): BrandStyle {
  const styles = {
    custom: CUSTOM_STYLE,
  };
  return styles[styleName as keyof typeof styles] || CUSTOM_STYLE;
}

/**
 * Retrieves a specific brand color
 * @param colorName - The name of the color to retrieve
 * @returns The color value as a string
 */
export function getBrandColor(colorName: keyof BrandStyle['colors']) {
  return BRAND_CONFIG.style.colors[colorName];
}

/**
 * Retrieves company information
 * @returns The company configuration object
 */
export function getCompanyInfo() {
  return BRAND_CONFIG.company;
}

/**
 * Retrieves social media links
 * @returns The social configuration object
 */
export function getSocialLinks() {
  return BRAND_CONFIG.social;
}

/**
 * Retrieves navigation configuration
 * @returns The navigation configuration object
 */
export function getNavigation() {
  return BRAND_CONFIG.navigation;
}

/**
 * Retrieves SEO configuration
 * @returns The SEO configuration object
 */
export function getSEOConfig() {
  return BRAND_CONFIG.seo;
}

/**
 * Retrieves the active style configuration
 * @returns The active BrandStyle object
 */
export function getStyleConfig() {
  return BRAND_CONFIG.style;
}

/**
 * Retrieves all available style presets
 * @returns An object mapping style names to their descriptions
 */
export function getAllAvailableStyles() {
  return {
    readwise: 'Readwise (Dark Gradient)',
    grok: 'Grok (Clean Minimal)',
    bannerbear: 'Bannerbear (Vibrant)',
    stripe: 'Stripe (Professional)',
    linear: 'Linear (Minimal Dark)',
    notion: 'Notion (Clean Light)',
    vercel: 'Vercel (Monochrome)',
  };
}

/**
 * Creates a brand variant by applying customizations to a base style
 * @param baseStyleName - The name of the base style
 * @param customizations - Partial style overrides to apply
 * @returns A new BrandStyle object with applied customizations
 * @throws Error if the base style is not found
 */
export function createBrandVariant(
  baseStyleName: string,
  customizations: Partial<BrandStyle>
) {
  const baseStyle =
    switchToStyle(baseStyleName) ||
    AVAILABLE_STYLES[baseStyleName as keyof typeof AVAILABLE_STYLES];
  if (!baseStyle) {
    throw new Error(`Style "${baseStyleName}" not found`);
  }
  return createCustomStyle(baseStyle, customizations);
}

/**
 * Generates structured data for SEO (Schema.org)
 * @returns A structured data object for organization schema
 */
export function generateStructuredData() {
  const { company, seo } = BRAND_CONFIG;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: seo.description,
    url: company.website,
    email: company.email,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
    },
    sameAs: [
      BRAND_CONFIG.social.twitter,
      BRAND_CONFIG.social.github,
      BRAND_CONFIG.social.linkedin,
    ].filter(Boolean),
  };
}

/**
 * Generates CSS classes based on the active style configuration
 * @returns An object containing CSS class names for styling
 */
export function getStyleClasses() {
  const style = BRAND_CONFIG.style;
  return {
    section: style.spacing.section,
    container: style.spacing.container,
    cardPadding: style.spacing.cardPadding,
    borderRadius: style.effects.borderRadius,
    shadow: style.effects.shadow,
    blur: style.effects.blur,
    heroText: style.typography.headingSize.hero,
    h1Text: style.typography.headingSize.h1,
    h2Text: style.typography.headingSize.h2,
    h3Text: style.typography.headingSize.h3,
    headingWeight: style.typography.headingWeight,
    bodyWeight: style.typography.bodyWeight,
    fontFamily: `font-${style.typography.fontFamily.toLowerCase().replace(/\s+/g, '-')}`,
  };
}

/**
 * Applies style properties to an HTML element
 * @param element - The HTML element to style
 * @param style - The BrandStyle to apply
 */
export function applyStyleToElement(element: HTMLElement, style: BrandStyle) {
  const cssVars = Object.entries({
    '--brand-primary': style.colors.primary,
    '--brand-background': style.colors.background,
    '--brand-text-primary': style.colors.textPrimary,
  });
  for (const [property, value] of cssVars) {
    element.style.setProperty(property, value);
  }
}
