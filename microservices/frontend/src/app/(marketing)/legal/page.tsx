'use client';

import { Cookie, Eye, FileText, Scale, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

const legalPages = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information',
    slug: 'privacy',
    icon: Eye,
    lastUpdated: 'December 15, 2024',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    description: 'The terms and conditions for using our service',
    slug: 'terms',
    icon: FileText,
    lastUpdated: 'December 15, 2024',
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    description:
      'Information about how we use cookies and similar technologies',
    slug: 'cookies',
    icon: Cookie,
    lastUpdated: 'December 15, 2024',
  },
  {
    id: 'dpa',
    title: 'Data Processing Agreement',
    description: 'Our commitment to data protection and GDPR compliance',
    slug: 'dpa',
    icon: Shield,
    lastUpdated: 'December 15, 2024',
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    description: 'Guidelines for appropriate use of our platform',
    slug: 'acceptable-use',
    icon: Users,
    lastUpdated: 'December 15, 2024',
  },
  {
    id: 'sla',
    title: 'Service Level Agreement',
    description:
      'Our commitments regarding service availability and performance',
    slug: 'sla',
    icon: Scale,
    lastUpdated: 'December 15, 2024',
  },
];

export default function LegalPage() {
  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="rounded-full p-4"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <Scale
                  className="h-12 w-12"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
            </div>
            <h1
              className="mb-6 font-bold text-4xl md:text-5xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Legal Information
            </h1>
            <p
              className="mb-8 text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              Our policies and legal documents to help you understand how we
              operate and protect your rights
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Legal Documents Grid */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {legalPages.map((page) => (
              <Link href={`/legal/${page.slug}`} key={page.id}>
                <Card
                  className="h-full cursor-pointer border transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center space-x-3">
                      <page.icon
                        className="h-6 w-6"
                        style={{ color: BRAND_CONFIG.brand.colors.primary }}
                      />
                      <CardTitle
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {page.title}
                      </CardTitle>
                    </div>
                    <CardDescription
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                      >
                        Updated: {page.lastUpdated}
                      </span>
                      <span
                        className="rounded px-2 py-1 text-sm"
                        style={{
                          backgroundColor:
                            BRAND_CONFIG.brand.colors.backgroundTertiary,
                          color: BRAND_CONFIG.brand.colors.textMuted,
                        }}
                      >
                        View →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Contact Section */}
          <Card
            className="mx-auto mt-16 max-w-2xl border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader className="text-center">
              <CardTitle
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Questions About Our Policies?
              </CardTitle>
              <CardDescription
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                We&apos;re here to help clarify any questions you may have about
                our legal documents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div>
                  <h4
                    className="mb-2 font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Contact Information
                  </h4>
                  <div
                    className="space-y-1 text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    <p>Email: {BRAND_CONFIG.company.email}</p>
                    <p>Phone: {BRAND_CONFIG.company.phone}</p>
                    <p>Address: {BRAND_CONFIG.company.address}</p>
                  </div>
                </div>
                <div
                  className="border-t pt-4"
                  style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
                >
                  <p
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    For legal matters, please allow 2-3 business days for a
                    response
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
