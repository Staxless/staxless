"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
      className="group-hover:[&>rect]:fill-[color:var(--color-primary)] group-hover:[&>path]:stroke-[color:var(--color-background)]"
    >
      <rect width="40" height="40" fill="var(--color-background)" />
      <path d="M10 30L30 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 20L20 10" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 30L30 20" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
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
        className="group flex items-center gap-2 font-medium transition-colors hover:bg-muted"
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

