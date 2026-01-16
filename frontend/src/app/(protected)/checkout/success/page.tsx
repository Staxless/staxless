'use client';

import {
  ArrowRight,
  CheckCircle,
  Download,
  Mail,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { markCheckoutSuccess } from '@/lib/confetti-utils';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Mark that checkout was successful for confetti trigger
    markCheckoutSuccess();
  }, []);

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
          {/* Success Message */}
          <div className="mb-12 text-center">
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${BRAND_CONFIG.brand.colors.success}20`,
              }}
            >
              <CheckCircle
                className="h-12 w-12"
                style={{ color: BRAND_CONFIG.brand.colors.success }}
              />
            </div>
            <h1
              className="mb-4 font-bold text-4xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Welcome to {BRAND_CONFIG.company.name}!
            </h1>
            <p
              className="text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              Your payment was successful. Let&apos;s get you started on your
              SaaS journey.
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <Card
              className="border text-center"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardContent className="p-6">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                  }}
                >
                  <Mail
                    className="h-6 w-6"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                </div>
                <h3
                  className="mb-2 font-semibold"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Check Your Email
                </h3>
                <p
                  className="text-sm"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  We&apos;ve sent you login credentials and setup instructions.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border text-center"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardContent className="p-6">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                  }}
                >
                  <Settings
                    className="h-6 w-6"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                </div>
                <h3
                  className="mb-2 font-semibold"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Set Up Your Account
                </h3>
                <p
                  className="text-sm"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  Complete your profile and configure your preferences.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border text-center"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardContent className="p-6">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                  }}
                >
                  <Download
                    className="h-6 w-6"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                </div>
                <h3
                  className="mb-2 font-semibold"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Download Resources
                </h3>
                <p
                  className="text-sm"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  Access starter templates and documentation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 text-center">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  className="px-8 py-3 font-semibold text-lg"
                  size="lg"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.primary,
                    color: 'white',
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/docs/quick-start">
                <Button
                  className="border px-8 py-3 text-lg"
                  size="lg"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                  variant="outline"
                >
                  Quick Start Guide
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Details */}
          <Card
            className="mt-12 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-6">
              <h3
                className="mb-4 font-semibold"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    Order ID:
                  </span>
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    #CS-{Date.now().toString().slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    Date:
                  </span>
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    Plan:
                  </span>
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Pro Plan
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    Next billing:
                  </span>
                  <span
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
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
