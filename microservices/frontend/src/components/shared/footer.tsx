'use client';

import { Github, X } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/shared/logo';
import { BRAND_CONFIG } from '@/lib/brand-config';
import StaxlessBadge from './staxless-badge';

export default function Footer() {
  const colors = BRAND_CONFIG.brand.colors;

  const linkStyle = {
    color: colors.textMuted,
  };

  const linkHoverProps = {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.color = colors.textPrimary;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.color = colors.textMuted;
    },
  };

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 justify-items-center gap-8 text-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col items-center space-y-4">
            <Link className="flex items-center space-x-2" href="/">
              <Logo size="medium" />
              <span
                className="font-bold text-xl"
                style={{ color: colors.textPrimary }}
              >
                {BRAND_CONFIG.company.name}
              </span>
            </Link>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {BRAND_CONFIG.company.description}
            </p>
            <div className="flex justify-center space-x-4">
              {BRAND_CONFIG.social.twitter && (
                <Link
                  className="transition-colors"
                  href={`https://twitter.com/${BRAND_CONFIG.social.twitter.replace('@', '')}`}
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">X</span>
                </Link>
              )}
              {BRAND_CONFIG.social.github && (
                <Link
                  className="transition-colors"
                  href={BRAND_CONFIG.social.github}
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center space-y-4">
            <h3
              className="font-bold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="/"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="#features"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="#pricing"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center space-y-4">
            <h3
              className="font-bold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="/docs"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="/docs/quick-start"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  Quick Start
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:underline"
                  href="#faq"
                  style={linkStyle}
                  {...linkHoverProps}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center space-y-4">
            <h3
              className="font-bold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              {BRAND_CONFIG.navigation.footer.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    className="text-sm transition-colors hover:underline"
                    href={link.href}
                    style={linkStyle}
                    {...linkHoverProps}
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
      <div style={{ borderTop: `1px solid ${colors.border}` }}>
        <div className="container mx-auto flex max-w-4xl flex-col items-center justify-between px-4 py-6 sm:flex-row">
          <StaxlessBadge />
        </div>
      </div>
    </footer>
  );
}
