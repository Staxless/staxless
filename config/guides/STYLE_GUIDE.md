# 🎨 Flexible Branding System Guide

This system allows you to easily switch between different design styles and create custom variations.

## 🚀 Quick Style Switching

Change the active style in `lib/brand-config.ts`:

\`\`\`typescript
// Switch to any predefined style
export const ACTIVE_STYLE: BrandStyle = GROK_STYLE      // Clean minimal
export const ACTIVE_STYLE: BrandStyle = BANNERBEAR_STYLE // Vibrant colors
export const ACTIVE_STYLE: BrandStyle = STRIPE_STYLE     // Professional
export const ACTIVE_STYLE: BrandStyle = READWISE_STYLE   // Dark gradient
\`\`\`

## 🎯 Available Styles

### 1. **Readwise Style** (Dark Gradient)
- Dark navy to purple gradient background
- Bright magenta primary color
- Glassmorphism effects
- Modern, premium feel

### 2. **Grok Style** (Clean Minimal)
- Pure white background
- Black primary color
- Minimal shadows and effects
- Clean, focused design

### 3. **Bannerbear Style** (Vibrant)
- Bright orange primary color
- Colorful gradients
- Playful, energetic feel
- Bold typography

### 4. **Stripe Style** (Professional)
- Purple primary color
- Clean, professional layout
- Subtle gradients
- Business-focused design

### 5. **Linear Style** (Minimal Dark)
- Dark background with purple accents
- Clean, minimal interface
- Subtle animations
- Developer-focused

### 6. **Notion Style** (Clean Light)
- Warm white background
- Blue primary color
- Simple, readable design
- Content-focused

### 7. **Vercel Style** (Monochrome)
- Black and white design
- Bold typography
- Minimal effects
- Developer-centric

## 🛠️ Creating Custom Styles

### Method 1: Extend Existing Style
\`\`\`typescript
const MY_CUSTOM_STYLE = createCustomStyle(STRIPE_STYLE, {
  colors: {
    primary: "#your-color",
    background: "#your-bg",
  },
  typography: {
    fontFamily: "Your Font",
  }
})
\`\`\`

### Method 2: Create From Scratch
\`\`\`typescript
const BRAND_NEW_STYLE: BrandStyle = {
  name: "my-style",
  colors: {
    primary: "#ff0000",
    // ... all required colors
  },
  typography: {
    // ... typography settings
  },
  spacing: {
    // ... spacing settings
  },
  effects: {
    // ... visual effects
  }
}
\`\`\`

## 🎨 Style Properties

### Colors
- `primary` - Main brand color
- `primaryHover` - Hover state
- `background` - Main background
- `textPrimary` - Main text color
- `gradientStart/Middle/End` - For gradient backgrounds

### Typography
- `fontFamily` - Font stack
- `headingWeight` - Font weight for headings
- `headingSize` - Responsive text sizes

### Effects
- `borderRadius` - Corner rounding
- `shadow` - Drop shadow intensity
- `glassmorphism` - Enable glass effects
- `animations` - Enable transitions

## 🔄 Dynamic Style Switching

\`\`\`typescript
// In your component
import { switchToStyle } from '@/lib/brand-config'

const newStyle = switchToStyle('grok')
// Apply the new style...
\`\`\`

## 📱 Responsive Considerations

All styles include responsive typography:
- `hero`: `text-5xl md:text-7xl`
- `h1`: `text-4xl md:text-5xl`
- `h2`: `text-3xl md:text-4xl`

## 🎯 Best Practices

1. **Test thoroughly** when switching styles
2. **Maintain contrast ratios** for accessibility
3. **Keep brand consistency** across all pages
4. **Use style utilities** for dynamic applications
5. **Document custom styles** for team members

## 🚀 Quick Examples

### E-commerce Style
\`\`\`typescript
const ECOMMERCE_STYLE = createCustomStyle(BANNERBEAR_STYLE, {
  colors: {
    primary: "#e11d48", // Rose-600
    secondary: "#fbbf24", // Amber-400
  }
})
\`\`\`

### SaaS Dashboard Style
\`\`\`typescript
const DASHBOARD_STYLE = createCustomStyle(LINEAR_STYLE, {
  effects: {
    glassmorphism: true,
    borderRadius: "rounded-xl",
  }
})
\`\`\`

### Marketing Site Style
\`\`\`typescript
const MARKETING_STYLE = createCustomStyle(STRIPE_STYLE, {
  typography: {
    headingSize: {
      hero: "text-6xl md:text-8xl",
    }
  }
})
\`\`\`

This system gives you the flexibility to match any design aesthetic while maintaining consistency and ease of use! 🎨
