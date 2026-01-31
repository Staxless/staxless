'use client';

import { Check, CreditCard, Loader2, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createCheckoutSession } from '@/app/actions/create-checkout-session';
import { getProducts, type Product } from '@/app/actions/get-products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BRAND_CONFIG } from '@config/brand-config';
import { getUserMessage, logError } from '@/lib/error-handling';

const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

export default function SelectionStep() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const colors = BRAND_CONFIG.brand.colors;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.success) {
          setProducts(result.data);
          // Default to second plan (most popular) if available
          if (result.data.length > 1) {
            setSelectedPlan(result.data[1]);
          } else if (result.data.length > 0) {
            setSelectedPlan(result.data[0]);
          }
        } else {
          logError(new Error(result.error), { action: 'fetchProducts' });
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } catch (error) {
        logError(error, { action: 'fetchProducts' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const getPlanPrice = (plan: Product): { amount: number; currency: string; period: string } => {
    const price = plan.default_price;
    if (!price || typeof price.unit_amount !== 'number') {
      return { amount: 0, currency: 'usd', period: '' };
    }

    const interval = price.recurring?.interval;
    let period = '';
    if (plan.isRecurring && interval) {
      period = interval === 'month' ? '/mo' : '/yr';
    }

    return {
      amount: price.unit_amount,
      currency: price.currency || 'usd',
      period,
    };
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      toast({
        title: 'Error',
        description: 'No plan selected. Please choose a plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createCheckoutSession(selectedPlan.id);
      if (result.success) {
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
        <p style={{ color: colors.textSecondary }}>No plans available.</p>
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

  const { amount, currency, period } = getPlanPrice(selectedPlan);

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
        {/* Plan Selection - Left Side */}
        <div className="lg:col-span-3 space-y-4">
          {products.map((plan, index) => {
            const planPrice = getPlanPrice(plan);
            const isSelected = selectedPlan?.id === plan.id;
            const isPopular = products.length > 1 && index === 1;

            return (
              <Card
                key={plan.id}
                className={`border cursor-pointer transition-all ${isSelected ? 'ring-2' : ''}`}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                  '--tw-ring-color': colors.primary,
                } as React.CSSProperties}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Radio indicator */}
                      <div
                        className="mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: colors.background }}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="font-semibold text-lg"
                            style={{ color: colors.textPrimary }}
                          >
                            {plan.name}
                          </h3>
                          {isPopular && (
                            <span
                              className="rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: colors.primary,
                                color: colors.background,
                              }}
                            >
                              Popular
                            </span>
                          )}
                        </div>
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {plan.description}
                        </p>

                        {/* Features */}
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                          {plan.features?.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
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
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-2xl" style={{ color: colors.textPrimary }}>
                        {formatPrice(planPrice.amount, planPrice.currency)}
                      </div>
                      <span className="text-sm" style={{ color: colors.textMuted }}>
                        {planPrice.period || 'one-time'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                    {selectedPlan.isRecurring
                      ? ` (${selectedPlan.default_price?.recurring?.interval === 'month' ? 'Monthly' : 'Annual'})`
                      : ' (Lifetime)'}
                  </span>
                  <span style={{ color: colors.textPrimary }}>
                    {formatPrice(amount, currency)}
                  </span>
                </div>

                <div
                  className="border-t pt-3"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex justify-between font-semibold">
                    <span style={{ color: colors.textPrimary }}>Total</span>
                    <span style={{ color: colors.textPrimary }}>
                      {formatPrice(amount, currency)}
                      {selectedPlan.isRecurring && (
                        <span className="font-normal text-sm" style={{ color: colors.textMuted }}>
                          {period}
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
                disabled={!selectedPlan || isProcessing}
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
