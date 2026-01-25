'use client';

import { Check, CreditCard, Loader2, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createCheckoutSession } from '@/app/actions/create-checkout-session';
import { getProducts, type Product } from '@/app/actions/get-products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { getUserMessage, logError } from '@/lib/error-handling';
import {
  getPlanSelection,
  getPreSelectedTier,
  getPreSelectedInterval,
  clearPlanSelection,
} from '@/lib/plan-selection';

interface FocusedCheckoutProps {
  hasPreSelectedPlan: boolean;
}

export default function FocusedCheckout({ hasPreSelectedPlan }: FocusedCheckoutProps) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const colors = BRAND_CONFIG.brand.colors;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine plan position (for upgrade nudge logic)
  const getPlanIndex = (plan: Product | null): number => {
    if (!plan || products.length === 0) return -1;
    return products.findIndex((p) => p.id === plan.id);
  };

  const planIndex = getPlanIndex(selectedPlan);
  const isHighestTier = planIndex === products.length - 1;
  const isLowestTier = planIndex === 0;
  const nextTierPlan = !isHighestTier && planIndex >= 0 ? products[planIndex + 1] : null;

  useEffect(() => {
    const fetchAndSelectPlan = async () => {
      try {
        const result = await getProducts();
        if (!result.success) {
          logError(new Error(result.error), { action: 'fetchProducts' });
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
          return;
        }

        const fetchedProducts = result.data;
        setProducts(fetchedProducts);

        // Get pre-selected plan from URL or sessionStorage
        const preSelectedTier = getPreSelectedTier(searchParams);
        const preSelectedInterval = getPreSelectedInterval(searchParams);
        const storedPlan = getPlanSelection();

        setBillingInterval(preSelectedInterval);

        // Find matching plan
        let matchedPlan: Product | null = null;

        if (preSelectedTier) {
          matchedPlan = fetchedProducts.find(
            (p) => p.name.toLowerCase() === preSelectedTier.toLowerCase()
          ) || null;
        }

        if (!matchedPlan && storedPlan) {
          matchedPlan = fetchedProducts.find((p) => p.id === storedPlan.productId) || null;
        }

        // Fall back to second plan (most popular) if no pre-selection
        if (!matchedPlan && fetchedProducts.length > 0) {
          matchedPlan = fetchedProducts[1] || fetchedProducts[0];
        }

        setSelectedPlan(matchedPlan);
      } catch (error) {
        logError(error, { action: 'fetchAndSelectPlan' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSelectPlan();
  }, [searchParams, toast]);

  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      toast({
        title: 'Error',
        description: 'No plan selected.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createCheckoutSession(selectedPlan.id);
      if (result.success) {
        clearPlanSelection(); // Clear stored selection
        window.location.href = result.data.url;
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      logError(error, { action: 'createCheckoutSession', planId: selectedPlan.id });
      toast({
        title: 'Error',
        description: getUserMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = (plan: Product) => {
    setSelectedPlan(plan);
  };

  const formatPrice = (plan: Product): string => {
    const amount = plan.default_price?.unit_amount;
    const currency = plan.default_price?.currency || 'usd';
    if (!amount) return '$0';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getPricePeriod = (plan: Product): string => {
    if (!plan.isRecurring) return '';
    const interval = plan.default_price?.recurring?.interval;
    return interval === 'month' ? '/mo' : '/yr';
  };

  const getUpgradePriceDiff = (): string => {
    if (!selectedPlan || !nextTierPlan) return '';
    const currentPrice = selectedPlan.default_price?.unit_amount || 0;
    const nextPrice = nextTierPlan.default_price?.unit_amount || 0;
    const diff = (nextPrice - currentPrice) / 100;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedPlan.default_price?.currency || 'usd',
      minimumFractionDigits: 0,
    }).format(diff);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="text-center py-12">
        <p style={{ color: colors.textSecondary }}>No plan found. Please select a plan.</p>
        <Link href="/#pricing">
          <Button
            className="mt-4"
            style={{ backgroundColor: colors.primary, color: colors.background }}
          >
            View Plans
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-2xl" style={{ color: colors.textPrimary }}>
          Complete your subscription
        </h1>
        <Link
          href="/#pricing"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: colors.textMuted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Plan Details - Left Side */}
        <div className="lg:col-span-3">
          <Card
            className="border"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2
                    className="font-semibold text-xl"
                    style={{ color: colors.textPrimary }}
                  >
                    {selectedPlan.name}
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {selectedPlan.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-3xl" style={{ color: colors.textPrimary }}>
                    {formatPrice(selectedPlan)}
                    <span className="font-normal text-base" style={{ color: colors.textMuted }}>
                      {getPricePeriod(selectedPlan)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Toggle - Only for recurring plans */}
              {selectedPlan.isRecurring && (
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-1 rounded-lg p-1"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                  >
                    <button
                      onClick={() => setBillingInterval('month')}
                      className="rounded-md px-4 py-2 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: billingInterval === 'month' ? colors.background : 'transparent',
                        color: billingInterval === 'month' ? colors.textPrimary : colors.textMuted,
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingInterval('year')}
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: billingInterval === 'year' ? colors.background : 'transparent',
                        color: billingInterval === 'year' ? colors.textPrimary : colors.textMuted,
                      }}
                    >
                      Annual
                      <span
                        className="rounded px-1.5 py-0.5 text-xs"
                        style={{ backgroundColor: `${colors.success}20`, color: colors.success }}
                      >
                        2 months free
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* One-time payment badge */}
              {!selectedPlan.isRecurring && (
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                    style={{ backgroundColor: `${colors.accent}15` }}
                  >
                    <span className="text-sm" style={{ color: colors.accent }}>
                      One-time purchase
                    </span>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                <h3
                  className="mb-4 font-medium text-sm"
                  style={{ color: colors.textMuted }}
                >
                  What&apos;s included:
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {selectedPlan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: colors.success }}
                      />
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Nudge - Only show for non-highest tiers */}
          {!isHighestTier && nextTierPlan && (
            <Card
              className="mt-4 border"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderColor: `${colors.primary}30`,
              }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" style={{ color: colors.primary }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: colors.textPrimary }}>
                      Upgrade to {nextTierPlan.name}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      Get more features for just {getUpgradePriceDiff()} more
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUpgrade(nextTierPlan)}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: colors.primary,
                    color: colors.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.primary;
                  }}
                >
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary - Right Side */}
        <div className="lg:col-span-2">
          <Card
            className="sticky top-24 border"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-6">
              <h3
                className="mb-4 font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>
                    {selectedPlan.name}
                    {selectedPlan.isRecurring && ` (${billingInterval === 'year' ? 'Annual' : 'Monthly'})`}
                    {!selectedPlan.isRecurring && ' (Lifetime)'}
                  </span>
                  <span style={{ color: colors.textPrimary }}>
                    {formatPrice(selectedPlan)}
                  </span>
                </div>

                <div
                  className="border-t pt-3"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex justify-between font-semibold">
                    <span style={{ color: colors.textPrimary }}>Total</span>
                    <span style={{ color: colors.textPrimary }}>
                      {formatPrice(selectedPlan)}
                      {selectedPlan.isRecurring && (
                        <span className="font-normal text-sm" style={{ color: colors.textMuted }}>
                          {getPricePeriod(selectedPlan)}
                        </span>
                      )}
                    </span>
                  </div>
                  {!selectedPlan.isRecurring && (
                    <p className="mt-2 text-xs" style={{ color: colors.textMuted }}>
                      Lifetime access included
                    </p>
                  )}
                </div>
              </div>

              <Button
                className="mt-6 w-full transition-colors"
                size="lg"
                disabled={isProcessing}
                onClick={handleProceedToPayment}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.backgroundColor = colors.primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </>
                )}
              </Button>

              {/* Trust Elements */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: colors.textMuted }}>
                  <Lock className="h-3 w-3" />
                  Secure checkout powered by Stripe
                </div>
                <p className="text-center text-xs" style={{ color: colors.textMuted }}>
                  {selectedPlan.isRecurring ? 'Cancel anytime · ' : ''}
                  14-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
