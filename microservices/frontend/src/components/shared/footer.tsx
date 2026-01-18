'use client';

import { Github, X } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/shared/logo';
import { BRAND_CONFIG } from '@/lib/brand-config';
import StaxlessBadge from './staxless-badge';

/**
 * Footer - The footer component for the application.
 * This component displays the footer with company info, quick links, resources, legal links,
 * and social media icons.
 *
 * @returns {JSX.Element} A footer layout with all sections.
 */

export default function Footer() {
  return (
    <footer className="w-full bg-muted">
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 justify-items-center gap-8 text-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col items-center space-y-4">
            <Link className="flex items-center space-x-2" href="/">
              <Logo size="medium" />
              <span className="font-bold text-xl">
                {BRAND_CONFIG.company.name}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {BRAND_CONFIG.company.description}
            </p>
            <div className="flex justify-center space-x-4">
              {BRAND_CONFIG.social.twitter && (
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href={`https://twitter.com/${BRAND_CONFIG.social.twitter.replace('@', '')}`}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">X</span>
                </Link>
              )}
              {BRAND_CONFIG.social.github && (
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href={BRAND_CONFIG.social.github}
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="#features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="#pricing"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-bold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="/docs/quick-start"
                >
                  Quick Start
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                  href="#faq"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-bold text-lg">Legal</h3>
            <ul className="space-y-2">
              {BRAND_CONFIG.navigation.footer.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    className="text-muted-foreground text-sm hover:text-foreground hover:underline"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-border border-t">
        <div className="container mx-auto flex max-w-4xl flex-col items-center justify-between px-4 py-6 sm:flex-row">
          <StaxlessBadge />
        </div>
      </div>
    </footer>
  );
}
