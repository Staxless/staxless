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
        className="mt-4 relative overflow-hidden group bg-[#1a0f2e] hover:bg-[#2a1f3e] text-[#f8fafc] transition-all duration-300 border-[#FF3366] hover:border-[#FF9933]"
        asChild
      >
        <a className="flex items-center gap-2 relative">
          <Sprinkles />
          <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">Built with</span>
          <span className="font-bold flex items-center gap-1 relative z-10">
            <StaxlessLogo />
            <span className="transition-opacity duration-300 group-hover:opacity-0 bg-gradient-text">STAXLESS</span>
          </span>
          <span className="sr-only">Built with Staxless</span>
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 transition-all duration-300"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="staxless-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="50%" stopColor="#FF9933" />
          <stop offset="100%" stopColor="#33CCFF" />
        </linearGradient>
      </defs>
      {/* Cube (visible by default) */}
      <g className="group-hover:opacity-0 transition-opacity duration-300" stroke="url(#staxless-gradient)">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.29 7L12 12.75 20.71 7" />
        <path d="M12 22.08V12" />
      </g>
      {/* Tesseract (visible on hover) */}
      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" stroke="url(#staxless-gradient)">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.29 7L12 12.75 20.71 7" />
        <path d="M12 22.08V12" />
      </g>
    </svg>
  );
}

function Sprinkles() {
  const colors = ["#FF3366", "#FF9933", "#33CCFF"];

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
            opacity: Math.random() * 0.3 + 0.1,
            transform: `scale(${Math.random() * 1 + 0.5})`,
            animation: `sparkle ${Math.random() * 4 + 2}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

