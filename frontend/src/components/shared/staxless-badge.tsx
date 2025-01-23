"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function StaxlessBadge() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Link href="/" passHref legacyBehavior>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 relative overflow-hidden group bg-[#0A0A0A] hover:bg-[#CCFF00] text-white hover:text-black transition-all duration-100 border-[#CCFF00] hover:border-[#0A0A0A]"
        asChild
      >
        <a className="flex items-center gap-2 relative font-bold">
          <StaxlessLogo />
          <span className="relative z-10 transition-all duration-100">BUILT WITH STAXLESS</span>
          <span className="sr-only">Built with Staxless</span>
        </a>
      </Button>
    </Link>
  )
}

function StaxlessLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:[&>rect]:fill-[#CCFF00] group-hover:[&>path]:stroke-[#0A0A0A]"
    >
      <rect width="40" height="40" fill="#0A0A0A" />
      <path d="M10 30L30 10" stroke="#CCFF00" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 20L20 10" stroke="#CCFF00" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 30L30 20" stroke="#CCFF00" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

