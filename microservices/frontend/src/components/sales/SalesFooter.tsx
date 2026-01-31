'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Instagram, Facebook, Youtube, Github } from 'lucide-react';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection } from '@config/sales-config';

const socialIcons: Record<string, React.ElementType> = {
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  YouTube: Youtube,
  Github: Github,
};

export default function SalesFooter() {
  const colors = BRAND_CONFIG.brand.colors;
  const footer = getSalesSection('footer');

  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: colors.backgroundTertiary,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div className="container mx-auto px-4">
        {/* Social Links */}
        {footer.socialMedia && footer.socialMedia.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {footer.socialMedia.map((social, index) => {
              const Icon = socialIcons[social.platform] || Twitter;
              return (
                <Link
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer Links */}
        {footer.links && footer.links.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {footer.links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: colors.textMuted }}
              >
                {link.text}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright */}
        <p
          className="text-center text-sm"
          style={{ color: colors.textMuted }}
        >
          {footer.copyright}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: colors.textMuted }}>
              SSL Secured
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: colors.textMuted }}>
              Money-Back Guarantee
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: colors.textMuted }}>
              Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
