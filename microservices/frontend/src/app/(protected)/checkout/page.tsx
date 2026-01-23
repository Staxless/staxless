'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import FocusedCheckout from '@/components/checkout/focused-checkout';
import SelectionStep from '@/components/checkout/selection-step';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { hasPreSelectedPlan, getPlanSelection } from '@/lib/plan-selection';
import { Loader2 } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const colors = BRAND_CONFIG.brand.colors;
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if there's a pre-selected plan from URL or sessionStorage
    const urlHasPlan = hasPreSelectedPlan(searchParams);
    const storedPlan = getPlanSelection();
    setHasPlan(urlHasPlan || storedPlan !== null);
  }, [searchParams]);

  // Show loading while determining which view to show
  if (hasPlan === null) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
      </div>
    );
  }

  // If user has a pre-selected plan, show focused checkout
  if (hasPlan) {
    return <FocusedCheckout hasPreSelectedPlan={true} />;
  }

  // Otherwise, show full plan selection
  return (
    <div>
      <h1
        className="mb-6 font-bold text-3xl"
        style={{ color: colors.textPrimary }}
      >
        Choose Your Plan
      </h1>
      <SelectionStep />
    </div>
  );
}

export default function CheckoutPage() {
  const colors = BRAND_CONFIG.brand.colors;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto p-4 pt-24">
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
