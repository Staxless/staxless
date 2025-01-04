"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StaxlessBadge() {
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
        <a className="flex items-center gap-2 relative">
          <Sprinkles />
          <span className="relative z-10">Built with</span>
          <span className="font-bold flex items-center gap-1 relative z-10">
            <StaxlessLogo />
            STAXLESS
          </span>
        </a>
      </Button>
    </Link>
  );
}

function StaxlessLogo() {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.29 7L12 12.75 20.71 7" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

function Sprinkles() {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            transform: `scale(${Math.random() * 1 + 0.5})`,
            animation: `sparkle ${Math.random() * 4 + 2}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
