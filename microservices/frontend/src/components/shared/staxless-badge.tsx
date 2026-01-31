'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';

interface StaxlessLogoProps {
  size?: number;
}

function StaxlessLogo({ size = 20 }: StaxlessLogoProps) {
  return (
    <svg
      aria-label="Staxless logo"
      className="group-hover:[&>path]:stroke-[var(--brand-background)] group-hover:[&>rect]:fill-[var(--brand-primary)]"
      fill="none"
      height={size}
      style={
        {
          // Define CSS variables for group-hover to avoid Tailwind limitations
          '--brand-primary': BRAND_CONFIG.brand.colors.primary,
          '--brand-background': BRAND_CONFIG.brand.colors.background,
        } as React.CSSProperties
      }
      viewBox="0 0 40 40"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Staxless logo</title>
      <rect
        fill={BRAND_CONFIG.brand.colors.background}
        height="40"
        width="40"
      />
      <path
        d="M10 30L30 10"
        stroke={BRAND_CONFIG.brand.colors.primary}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M10 20L20 10"
        stroke={BRAND_CONFIG.brand.colors.primary}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M20 30L30 20"
        stroke={BRAND_CONFIG.brand.colors.primary}
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export default function StaxlessBadge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Link href="/" passHref>
      <Button
        asChild
        className="group flex items-center gap-2 font-medium transition-colors hover:bg-[var(--brand-muted)]"
        style={
          {
            borderColor: BRAND_CONFIG.brand.colors.border,
            color: BRAND_CONFIG.brand.colors.textPrimary,
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            '--brand-muted': BRAND_CONFIG.brand.colors.backgroundTertiary,
          } as React.CSSProperties
        }
        variant="outline"
      >
        <span>
          <StaxlessLogo size={24} />
          <span>Built with Staxless</span>
        </span>
      </Button>
    </Link>
  );
}
