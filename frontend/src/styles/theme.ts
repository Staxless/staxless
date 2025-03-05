export const defaultTheme = {
  primary: "#3B82F6", // Blue
  secondary: "#10B981", // Green
  background: "#FFFFFF",
  text: "#1F2937",
  textMuted: "#6B7280",
  accent: "#F3F4F6",
}

  export type Theme = typeof defaultTheme
  
  export function setTheme(theme: Partial<Theme> = {}) {
    const mergedTheme = { ...defaultTheme, ...theme }
    Object.entries(mergedTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })
  }
  
  