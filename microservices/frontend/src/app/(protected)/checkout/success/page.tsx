'use client';

import {
  ArrowRight,
  CheckCircle,
  Download,
  Loader2,
  Mail,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getCheckoutSession, type CheckoutSessionData } from '@/app/actions/get-checkout-session';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';
import { markCheckoutSuccess } from '@/lib/confetti-utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const colors = BRAND_CONFIG.brand.colors;
  const sessionId = searchParams.get('session_id');

  const [sessionData, setSessionData] = useState<CheckoutSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark that checkout was successful for confetti trigger
    markCheckoutSuccess();

    // Fetch session data if we have a session ID
    const fetchSessionData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getCheckoutSession(sessionId);
        if (result.success) {
          setSessionData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const formatCurrency = (amount: number | null, currency: string | null): string => {
    if (!amount || !currency) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getIntervalLabel = (interval: string | null): string => {
    if (!interval) return '';
    return interval === 'year' ? 'Annual' : 'Monthly';
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.success}20` }}
          >
            <CheckCircle className="h-12 w-12" style={{ color: colors.success }} />
          </div>
          <h1 className="mb-4 font-bold text-4xl" style={{ color: colors.textPrimary }}>
            Welcome to {BRAND_CONFIG.company.name}!
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>
            Your payment was successful. Let&apos;s get you started.
          </p>
        </div>

        {/* Next Steps */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card
            className="border text-center"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-6">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Mail className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: colors.textPrimary }}>
                Check Your Email
              </h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                We&apos;ve sent you a receipt and setup instructions.
              </p>
            </CardContent>
          </Card>

          <Card
            className="border text-center"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-6">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Settings className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: colors.textPrimary }}>
                Set Up Your Account
              </h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Complete your profile and configure your preferences.
              </p>
            </CardContent>
          </Card>

          <Card
            className="border text-center"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-6">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Download className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: colors.textPrimary }}>
                Download Resources
              </h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
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
                className="px-8 py-3 font-semibold text-lg transition-colors"
                size="lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/docs/quick-start">
              <Button
                className="border px-8 py-3 text-lg transition-colors"
                size="lg"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
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
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold" style={{ color: colors.textPrimary }}>
              Order Details
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.primary }} />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: colors.textMuted }}>Order ID:</span>
                  <span className="font-mono" style={{ color: colors.textPrimary }}>
                    {sessionData?.id ? `#${sessionData.id.slice(-8).toUpperCase()}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.textMuted }}>Date:</span>
                  <span style={{ color: colors.textPrimary }}>
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.textMuted }}>Plan:</span>
                  <span style={{ color: colors.textPrimary }}>
                    {sessionData?.planName || 'N/A'}
                    {sessionData?.interval && ` (${getIntervalLabel(sessionData.interval)})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.textMuted }}>Amount:</span>
                  <span style={{ color: colors.textPrimary }}>
                    {formatCurrency(sessionData?.amount ?? null, sessionData?.currency ?? null)}
                  </span>
                </div>
                {sessionData?.nextBillingDate && (
                  <div className="flex justify-between">
                    <span style={{ color: colors.textMuted }}>Next billing:</span>
                    <span style={{ color: colors.textPrimary }}>
                      {formatDate(sessionData.nextBillingDate)}
                    </span>
                  </div>
                )}
                {sessionData?.customerEmail && (
                  <div className="flex justify-between">
                    <span style={{ color: colors.textMuted }}>Receipt sent to:</span>
                    <span style={{ color: colors.textPrimary }}>
                      {sessionData.customerEmail}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center pt-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
