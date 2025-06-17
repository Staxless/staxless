

import type { BrandStyle } from "./brand-config"

// Linear.app-inspired minimal dark
export const LINEAR_STYLE: BrandStyle = {
  name: "linear",
  colors: {
    primary: "#5e6ad2",
    primaryHover: "#4c63d2",
    secondary: "#16181d",
    accent: "#2c2f36",
    success: "#00d924",
    warning: "#ff8c00",
    error: "#ff6b6b",
    background: "#0d0e11",
    backgroundSecondary: "#16181d",
    backgroundTertiary: "#1c1f26",
    textPrimary: "#ffffff",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    border: "#2c2f36",
    borderLight: "#374151",
  },
  typography: {
    fontFamily: "SF Pro Display",
    headingWeight: "font-medium",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-4xl md:text-5xl",
      h1: "text-3xl md:text-4xl",
      h2: "text-2xl md:text-3xl",
      h3: "text-xl md:text-2xl",
    },
  },
  spacing: {
    section: "py-16",
    container: "max-w-5xl mx-auto px-6",
    cardPadding: "p-6",
  },
  effects: {
    borderRadius: "rounded-lg",
    shadow: "shadow-sm",
    blur: "backdrop-blur-sm",
    glassmorphism: false,
    animations: true,
  },
}

// Notion-inspired clean
export const NOTION_STYLE: BrandStyle = {
  name: "notion",
  colors: {
    primary: "#2383e2",
    primaryHover: "#1a73d1",
    secondary: "#f7f6f3",
    accent: "#e9e5e0",
    success: "#0f7b0f",
    warning: "#d9730d",
    error: "#e03e3e",
    background: "#ffffff",
    backgroundSecondary: "#fbfbfa",
    backgroundTertiary: "#f7f6f3",
    textPrimary: "#37352f",
    textSecondary: "#6f6e69",
    textMuted: "#9b9a97",
    border: "#e9e5e0",
    borderLight: "#d3d1cb",
  },
  typography: {
    fontFamily: "ui-sans-serif",
    headingWeight: "font-semibold",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-4xl md:text-5xl",
      h1: "text-3xl md:text-4xl",
      h2: "text-2xl md:text-3xl",
      h3: "text-xl md:text-2xl",
    },
  },
  spacing: {
    section: "py-16",
    container: "max-w-4xl mx-auto px-6",
    cardPadding: "p-6",
  },
  effects: {
    borderRadius: "rounded-md",
    shadow: "shadow-sm",
    blur: "backdrop-blur-none",
    glassmorphism: false,
    animations: false,
  },
}

// Vercel-inspired
export const VERCEL_STYLE: BrandStyle = {
  name: "vercel",
  colors: {
    primary: "#000000",
    primaryHover: "#1a1a1a",
    secondary: "#fafafa",
    accent: "#eaeaea",
    success: "#0070f3",
    warning: "#f5a623",
    error: "#ee0000",
    background: "#ffffff",
    backgroundSecondary: "#fafafa",
    backgroundTertiary: "#f4f4f4",
    textPrimary: "#000000",
    textSecondary: "#666666",
    textMuted: "#999999",
    border: "#eaeaea",
    borderLight: "#d4d4d4",
  },
  typography: {
    fontFamily: "Inter",
    headingWeight: "font-bold",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-5xl md:text-6xl",
      h1: "text-4xl md:text-5xl",
      h2: "text-3xl md:text-4xl",
      h3: "text-2xl md:text-3xl",
    },
  },
  spacing: {
    section: "py-20",
    container: "max-w-6xl mx-auto px-6",
    cardPadding: "p-8",
  },
  effects: {
    borderRadius: "rounded-lg",
    shadow: "shadow-lg",
    blur: "backdrop-blur-sm",
    glassmorphism: false,
    animations: true,
  },
}

// Grok.com-inspired clean minimal style
export const GROK_STYLE: BrandStyle = {
  name: "grok",
  colors: {
    primary: "#000000",
    primaryHover: "#1a1a1a",
    secondary: "#f5f5f5",
    accent: "#e5e5e5",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#ffffff",
    backgroundSecondary: "#f9fafb",
    backgroundTertiary: "#f3f4f6",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    borderLight: "#d1d5db",
  },
  typography: {
    fontFamily: "system-ui",
    headingWeight: "font-medium",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-4xl md:text-6xl",
      h1: "text-3xl md:text-4xl",
      h2: "text-2xl md:text-3xl",
      h3: "text-xl md:text-2xl",
    },
  },
  spacing: {
    section: "py-16",
    container: "max-w-6xl mx-auto px-6",
    cardPadding: "p-6",
  },
  effects: {
    borderRadius: "rounded-lg",
    shadow: "shadow-sm",
    blur: "backdrop-blur-sm",
    glassmorphism: false,
    animations: false,
  },
}

// Peter Carlson Jr. inspired - Iridescent Botanical
export const REVELATOR_STYLE: BrandStyle = {
  name: "revelator",
  colors: {
    primary: "#2dd4bf",
    primaryHover: "#14b8a6",
    secondary: "#1e293b",
    accent: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    gradientStart: "#0f172a",
    gradientMiddle: "#1e3a8a",
    gradientEnd: "#065f46",
    background: "#0f172a",
    backgroundSecondary: "#1e293b",
    backgroundTertiary: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    border: "#334155",
    borderLight: "#475569",
  },
  typography: {
    fontFamily: "system-ui",
    headingWeight: "font-medium",
    bodyWeight: "font-normal",
    headingSize: {
      hero: "text-5xl md:text-7xl",
      h1: "text-4xl md:text-6xl",
      h2: "text-3xl md:text-4xl",
      h3: "text-2xl md:text-3xl",
    },
  },
  spacing: {
    section: "py-24",
    container: "max-w-6xl mx-auto px-6",
    cardPadding: "p-8",
  },
  effects: {
    borderRadius: "rounded-2xl",
    shadow: "shadow-2xl",
    blur: "backdrop-blur-xl",
    gradient: "bg-linear-to-br",
    glassmorphism: true,
    animations: true,
  },
}

// Export all available styles
export const AVAILABLE_STYLES = {
  linear: LINEAR_STYLE,
  notion: NOTION_STYLE,
  vercel: VERCEL_STYLE,
  grok: GROK_STYLE,
  revelator: REVELATOR_STYLE,
}
