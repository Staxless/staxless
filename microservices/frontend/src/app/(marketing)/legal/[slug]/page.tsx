'use client';

import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Card, CardContent } from '@/components/ui/card';
import { getPolicyContent } from '@/content/policy-content';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function PolicyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const policy = getPolicyContent(slug);

  if (!policy) {
    return (
      <div
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.background,
          minHeight: '100vh',
        }}
      >
        <Header user={null} />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1
              className="mb-4 font-bold text-4xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Policy Not Found
            </h1>
            <p
              className="mb-8"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              The requested policy page could not be found.
            </p>
            <Link
              className="inline-flex items-center space-x-2 hover:underline"
              href="/legal"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Legal</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header user={null} />

      <div className="pt-20">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center space-x-2">
            <Link
              className="flex items-center space-x-1 hover:underline"
              href="/legal"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Legal</span>
            </Link>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              /
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              {policy.title}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center space-x-3">
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <FileText
                  className="h-6 w-6"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
              <h1
                className="font-bold text-4xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                {policy.title}
              </h1>
            </div>

            <div
              className="flex items-center space-x-6 text-sm"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Effective: {policy.effectiveDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Last updated: {policy.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card
            className="border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-8">
              <div
                className="prose prose-invert max-w-none"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                {policy.content.map((section) => (
                  <div className="mb-8" key={section.content + section.type}>
                    {section.type === 'heading' && (
                      <h2
                        className="mt-8 mb-4 font-bold text-2xl first:mt-0"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {section.content}
                      </h2>
                    )}
                    {section.type === 'subheading' && (
                      <h3
                        className="mt-6 mb-3 font-semibold text-xl"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {section.content}
                      </h3>
                    )}
                    {section.type === 'paragraph' && (
                      <p
                        className="mb-4 leading-relaxed"
                        style={{
                          color: BRAND_CONFIG.brand.colors.textSecondary,
                        }}
                      >
                        {section.content}
                      </p>
                    )}
                    {section.type === 'list' && (
                      <ul className="mb-4 list-disc space-y-2 pl-6">
                        {section.items?.map((item) => (
                          <li
                            key={item}
                            style={{
                              color: BRAND_CONFIG.brand.colors.textSecondary,
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.type === 'numbered-list' && (
                      <ol className="mb-4 list-decimal space-y-2 pl-6">
                        {section.items?.map((item) => (
                          <li
                            key={item}
                            style={{
                              color: BRAND_CONFIG.brand.colors.textSecondary,
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card
            className="mt-8 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-6">
              <h3
                className="mb-3 font-semibold text-lg"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Questions about this policy?
              </h3>
              <p
                className="mb-4"
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                If you have any questions about this{' '}
                {policy.title.toLowerCase()}, please contact us:
              </p>
              <div
                className="space-y-2 text-sm"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                <p>Email: {BRAND_CONFIG.company.email}</p>
                <p>Address: {BRAND_CONFIG.company.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
