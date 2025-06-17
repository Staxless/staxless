"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BRAND_CONFIG } from "@/lib/brand-config"

interface StaxlessLogoProps {
  size?: number
}

function StaxlessLogo({ size = 20 }: StaxlessLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:[&>rect]:fill-[var(--brand-primary)] group-hover:[&>path]:stroke-[var(--brand-background)]"
      style={{
        // Define CSS variables for group-hover to avoid Tailwind limitations
        '--brand-primary': BRAND_CONFIG.brand.colors.primary,
        '--brand-background': BRAND_CONFIG.brand.colors.background,
      } as React.CSSProperties}
    >
      <rect width="40" height="40" fill={BRAND_CONFIG.brand.colors.background} />
      <path d="M10 30L30 10" stroke={BRAND_CONFIG.brand.colors.primary} strokeWidth="4" strokeLinecap="round" />
      <path d="M10 20L20 10" stroke={BRAND_CONFIG.brand.colors.primary} strokeWidth="4" strokeLinecap="round" />
      <path d="M20 30L30 20" stroke={BRAND_CONFIG.brand.colors.primary} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export default function StaxlessBadge() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Link href="/" passHref>
      <Button
        variant="outline"
        className="group flex items-center gap-2 font-medium transition-colors hover:bg-[var(--brand-muted)]"
        style={{
          borderColor: BRAND_CONFIG.brand.colors.border,
          color: BRAND_CONFIG.brand.colors.textPrimary,
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          '--brand-muted': BRAND_CONFIG.brand.colors.backgroundTertiary,
        } as React.CSSProperties}
        asChild
      >
        <a>
          <StaxlessLogo size={24} />
          <span>Built with Staxless</span>
        </a>
      </Button>
    </Link>
  )
}