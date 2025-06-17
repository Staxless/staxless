# 🎨 White Label Branding Guide

This guide shows you how to customize your SaaS application branding in one place.

## 📝 Quick Setup

All branding configuration is centralized in `/lib/brand-config.ts`. Edit this single file to customize your entire application.

### 1. Company Information
\`\`\`typescript
company: {
  name: "Your SaaS Name",           // Appears in header, footer, metadata
  tagline: "Your Tagline",          // Used in hero section
  description: "Your description",   // Used in hero, footer, SEO
  website: "https://yoursite.com",
  email: "hello@yoursite.com",
  // ... other contact info
}
\`\`\`

### 2. Visual Identity
\`\`\`typescript
brand: {
  logo: {
    text: "Y",  // Single letter for simple logo
  },
  colors: {
    primary: "#your-color",      // Main brand color
    primaryHover: "#darker",     // Hover state
    // ... other colors
  }
}
\`\`\`

### 3. Content Customization
\`\`\`typescript
content: {
  hero: {
    title: "Your Hero Title",
    titleHighlight: "Highlighted Word",
    subtitle: "Your subtitle...",
    primaryCTA: "Your CTA Button",
    secondaryCTA: "Secondary Button",
  },
  // ... features, pricing, FAQ, etc.
}
\`\`\`

### 4. SEO & Metadata
\`\`\`typescript
seo: {
  title: "Your SEO Title",
  description: "Your meta description",
  keywords: ["your", "keywords"],
  ogImage: "/your-og-image.png",
}
\`\`\`

## 🚀 Advanced Customization

### Custom Logo
Replace the simple text logo by updating the Logo component in `/components/shared/logo.tsx`:

\`\`\`tsx
// Replace text with image
<img src="/your-logo.png" alt={BRAND_CONFIG.company.name} width={logoSize} height={logoSize} />
\`\`\`

### Custom Colors
The color system automatically applies your brand colors throughout the app. You can also use CSS custom properties:

\`\`\`css
/* These are automatically generated from your config */
var(--brand-primary)
var(--brand-secondary)
var(--brand-accent)
\`\`\`

### Custom Fonts
Update the font configuration and import your fonts in `/app/layout.tsx`.

## 📋 Checklist

- [ ] Update company information
- [ ] Set brand colors
- [ ] Customize hero content
- [ ] Update features list
- [ ] Configure social links
- [ ] Set SEO metadata
- [ ] Add your logo/favicon
- [ ] Test all pages
- [ ] Update legal pages

## 🔧 Development Tips

1. **Type Safety**: The configuration is fully typed for better developer experience
2. **Hot Reload**: Changes to the config file will hot reload in development
3. **Utilities**: Use helper functions from `/lib/brand-utils.ts` for consistent access
4. **CSS Variables**: Brand colors are available as CSS custom properties
5. **SEO**: Structured data is automatically generated from your config

## 📁 Files to Customize

**Required:**
- `/lib/brand-config.ts` - Main configuration file

**Optional:**
- `/components/shared/logo.tsx` - Custom logo component
- `/app/globals.css` - Additional custom styles
- `/public/` - Add your logo, favicon, og-image files

That's it! Your entire application branding is now controlled from one central location.
