'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/app/actions/get-products';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { logError } from '@/lib/error-handling';
import { ProductGridSkeleton } from '@/components/ui/skeletons';
import { storePlanSelection } from '@/lib/plan-selection';

const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

export default function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const colors = BRAND_CONFIG.brand.colors;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await getProducts();
        if (result.success) {
          setPlans(result.data);
        } else {
          logError(new Error(result.error), { action: 'fetchPlans' });
          setPlans([]);
        }
      } catch (error) {
        logError(error, { action: 'fetchPlans' });
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: Product) => {
    const interval = plan.default_price?.recurring?.interval || 'year';
    storePlanSelection({
      productId: plan.id,
      priceId: plan.default_price?.id || '',
      tier: plan.name,
      interval: interval as 'month' | 'year',
    });

    const params = new URLSearchParams({
      plan: plan.name.toLowerCase(),
      price: plan.default_price?.id || '',
      interval,
    });

    router.push(`/register?${params.toString()}`);
  };

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

  const renderPlanCard = (plan: Product, index: number, isPopular: boolean) => {
    const { amount, currency, period } = getPlanPrice(plan);

    return (
      <div
        className="relative rounded-lg border-2 p-8 shadow-lg transition-transform hover:scale-[1.02]"
        key={plan.id}
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderColor: isPopular ? colors.primary : colors.border,
        }}
      >
        {isPopular && (
          <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
            <span
              className="rounded-full px-4 py-1 font-medium text-sm"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Most Popular
            </span>
          </div>
        )}

        <div className="mb-8 text-center">
          <h3
            className="mb-2 font-bold text-2xl"
            style={{ color: colors.textPrimary }}
          >
            {plan.name}
          </h3>
          <div className="mb-2">
            <span
              className="font-bold text-4xl"
              style={{ color: colors.textPrimary }}
            >
              {formatPrice(amount, currency)}
            </span>
            {period ? (
              <span className="text-lg" style={{ color: colors.textMuted }}>
                {period}
              </span>
            ) : (
              <span className="ml-2 text-sm" style={{ color: colors.textMuted }}>
                one-time
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {plan.description}
          </p>
        </div>

        <ul className="mb-8 space-y-4">
          {plan.features?.map((feature, featureIndex) => (
            <li
              className="flex items-center"
              key={typeof feature === 'string' ? feature : featureIndex}
            >
              <Check
                className="mr-3 h-5 w-5 flex-shrink-0"
                style={{ color: colors.success }}
              />
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full transition-colors"
          size="lg"
          onClick={() => handleSelectPlan(plan)}
          style={
            isPopular
              ? {
                  backgroundColor: colors.primary,
                  color: colors.background,
                }
              : {
                  backgroundColor: 'transparent',
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }
          }
          onMouseEnter={(e) => {
            if (isPopular) {
              e.currentTarget.style.backgroundColor = colors.primaryHover;
            } else {
              e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
            }
          }}
          onMouseLeave={(e) => {
            if (isPopular) {
              e.currentTarget.style.backgroundColor = colors.primary;
            } else {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Get Started
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section
        className="py-20"
        id="pricing"
        style={{ backgroundColor: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 font-bold text-4xl"
              style={{ color: colors.textPrimary }}
            >
              {BRAND_CONFIG.content.pricing.title}
            </h2>
            <p className="text-xl" style={{ color: colors.textSecondary }}>
              {BRAND_CONFIG.content.pricing.subtitle}
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <ProductGridSkeleton count={3} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20"
      id="pricing"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 font-bold text-4xl"
            style={{ color: colors.textPrimary }}
          >
            {BRAND_CONFIG.content.pricing.title}
          </h2>
          <p
            className="text-xl"
            style={{ color: colors.textSecondary }}
          >
            {BRAND_CONFIG.content.pricing.subtitle}
          </p>
        </div>

        <div
          className={`mx-auto grid max-w-5xl gap-8 ${
            plans.length === 1
              ? 'md:grid-cols-1 max-w-md'
              : plans.length === 2
                ? 'md:grid-cols-2 max-w-3xl'
                : 'md:grid-cols-3'
          }`}
        >
          {plans.map((plan, index) => {
            const isPopular = plans.length > 1 && index === 1;
            return renderPlanCard(plan, index, isPopular);
          })}
        </div>

        {/* Trust Elements */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            14-day money-back guarantee · Secure payment
          </p>
        </div>
      </div>
    </section>
  );
}
