"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BuildToScaleBadge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Link href="/" passHref legacyBehavior>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 relative overflow-hidden group hover:text-white transition-colors duration-300"
        asChild
      >
        <a className="flex items-center gap-2 relative z-10">
          <Sprinkles />
          <span>Built with</span>
          <span className="font-bold flex items-center gap-1">
            <BuildToScaleLogo />
            Build to Scale
          </span>
        </a>
      </Button>
    </Link>
  );
}

function BuildToScaleLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M2 20h20" />
      <path d="M5 20v-4a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v4" />
      <path d="M12 15V3" />
      <path d="m9 6 3-3 3 3" />
    </svg>
  );
}

function Sprinkles() {
  return (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            transform: `scale(${Math.random() * 1 + 0.5})`,
          }}
        />
      ))}
    </div>
  );
}
