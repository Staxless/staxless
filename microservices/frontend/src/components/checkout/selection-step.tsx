'use client';

import { Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createCheckoutSession } from '@/app/actions/create-checkout-session';
import { getProducts, type Product } from '@/app/actions/get-products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function SelectionStep() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setSelectedPlanId(fetchedProducts[1]?.id || ''); // Default to second plan
      } catch {
        // Ignore product fetch errors
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedPlan = products.find((p) => p.id === selectedPlanId);
  const basePrice = selectedPlan?.default_price?.unit_amount
    ? selectedPlan.default_price.unit_amount / 100
    : 0;
  const isRecurring = selectedPlan?.isRecurring;
  const recurringInterval = selectedPlan?.default_price?.recurring?.interval;

  // Determine the display period based on billing cycle and recurring interval
  const getDisplayPeriod = (plan: Product) => {
    const interval = plan.default_price.recurring?.interval;

    if (!plan.isRecurring) {
      return ''; // No period for one-time payments
    }
    if (interval === 'month' && recurringInterval === 'month') {
      return '/mo';
    }
    if (interval === 'year' && recurringInterval === 'year') {
      return '/yr';
    }
    return `/${interval}`; // Fallback to the product's recurring interval
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
      const { url } = await createCheckoutSession(selectedPlan.id);
      window.location.href = url; // Redirect to Stripe checkout
    } catch (_error) {
      toast({
        title: 'Error',
        description: `Failed to proceed to payment. Please try again. ${_error}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = !!selectedPlanId;

  if (isLoading || !products.length) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Plan Selection */}
      <div>
        <h2
          className="mb-6 font-bold text-2xl"
          style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
        >
          Choose Your Plan
        </h2>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((plan) => (
            <Card
              className={`cursor-pointer border-2 transition-all duration-200 ${
                selectedPlanId === plan.id ? 'ring-2' : ''
              }`}
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor:
                  selectedPlanId === plan.id
                    ? BRAND_CONFIG.brand.colors.primary
                    : BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader className="text-center">
                <CardTitle
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {plan.name}
                </CardTitle>
                <div
                  className="font-bold text-3xl"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  $
                  {plan.default_price?.unit_amount
                    ? (plan.default_price.unit_amount / 100).toFixed(2)
                    : '0'}
                  <span
                    className="font-normal text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    {getDisplayPeriod(plan)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {plan.images?.[0] && (
                  <Image
                    alt={plan.name}
                    className="mb-4 h-32 w-full rounded object-cover"
                    height={128}
                    src={plan.images[0]}
                    width={400}
                  />
                )}
                <p
                  className="mb-4 text-sm"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features?.map((feature) => (
                    <li className="flex items-center space-x-2" key={feature}>
                      <Check
                        className="h-4 w-4"
                        style={{ color: BRAND_CONFIG.brand.colors.primary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {feature}
                      </span>
                    </li>
                  )) || <li>No features listed</li>}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Summary */}
      <Card
        className="border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              {selectedPlan?.name}{' '}
              {isRecurring
                ? `(${recurringInterval}ly recurring)`
                : '(One-time)'}
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              ${basePrice.toFixed(2)}{' '}
              {selectedPlan ? getDisplayPeriod(selectedPlan) : ''}
            </span>
          </div>
          <div
            className="border-t pt-3"
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
          >
            <div className="flex justify-between font-semibold text-lg">
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Total
              </span>
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                ${basePrice.toFixed(2)}{' '}
                {selectedPlan ? getDisplayPeriod(selectedPlan) : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proceed to Payment Button */}
      <Button
        className="w-full py-3 font-semibold text-lg"
        disabled={!isFormValid || isProcessing}
        onClick={handleProceedToPayment}
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.primary,
          color: 'white',
        }}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="mr-2 h-5 w-5" />
            <span>Proceed to Payment</span>
          </div>
        )}
      </Button>
    </div>
  );
}
