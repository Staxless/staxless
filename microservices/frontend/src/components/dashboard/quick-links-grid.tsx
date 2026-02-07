'use client';

import {
  BookOpen,
  Cloud,
  CreditCard,
  ExternalLink,
  FileText,
  Rocket,
  Shield,
  Terminal,
  Wrench,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

const QUICK_LINKS = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Set up your project in minutes',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: FileText,
    title: 'Add a Page',
    description: 'Create new routes and pages',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: CreditCard,
    title: 'Add Stripe Plan',
    description: 'Configure payment plans',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: Shield,
    title: 'Add OAuth Provider',
    description: 'Enable social login',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: Terminal,
    title: 'CLI Reference',
    description: 'All CLI commands documented',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: Wrench,
    title: 'Troubleshooting',
    description: 'Common issues and fixes',
    href: 'https://github.com/Staxless/staxless-docs',
  },
  {
    icon: Cloud,
    title: 'Deploy to Production',
    description: 'Ship with one command',
    href: 'https://github.com/Staxless/staxless-docs',
  },
];

export default function QuickLinksGrid() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <Card
      className="border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            <BookOpen className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
          <div>
            <CardTitle
              className="font-semibold text-lg"
              style={{ color: colors.textPrimary }}
            >
              Documentation & Tutorials
            </CardTitle>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              14 task-based tutorials to help you build
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border p-3 transition-colors"
              style={{ borderColor: colors.border }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <link.icon
                className="h-5 w-5 shrink-0"
                style={{ color: colors.primary }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className="font-medium text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {link.title}
                </p>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {link.description}
                </p>
              </div>
              <ExternalLink
                className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: colors.textMuted }}
              />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
