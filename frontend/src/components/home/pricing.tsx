'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/app/actions/get-products';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

const formatPrice = (
  price: unknown,
  isRecurring: boolean,
  interval?: string,
  billingCycle?: 'monthly' | 'yearly'
) => {
  if (
    !price ||
    typeof price !== 'object' ||
    price === null ||
    !('currency' in price) ||
    !('unit_amount' in price) ||
    typeof (price as { currency?: unknown }).currency !== 'string' ||
    typeof (price as { unit_amount?: unknown }).unit_amount !== 'number'
  ) {
    return 'Contact us';
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (price as { currency: string }).currency,
    minimumFractionDigits: 0,
  }).format((price as { unit_amount: number }).unit_amount / 100);

  // Append period for recurring plans
  if (!isRecurring) {
    return formattedPrice;
  }
  if (!interval) {
    return formattedPrice; // Fallback if interval is undefined
  }
  if (interval === 'month' && billingCycle === 'monthly') {
    return `${formattedPrice}/mo`;
  }
  if (interval === 'year' && billingCycle === 'yearly') {
    return `${formattedPrice}/yr`;
  }
  return `${formattedPrice}/${interval}`;
};

export default function Pricing() {
  const [plans, setPlans] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const products = await getProducts();
        setPlans(products);
      } catch (_error) {
        // Intentionally left blank: no action needed on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (isLoading) {
    return (
      <section
        className="py-20"
        id="pricing"
        style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
      >
        <div className="container mx-auto px-4 text-center">
          <div
            className="animate-pulse"
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            Loading pricing...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20"
      id="pricing"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 font-bold text-4xl"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            {BRAND_CONFIG.content.pricing.title}
          </h2>
          <p
            className="text-xl"
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            {BRAND_CONFIG.content.pricing.subtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              className={`rounded-lg border-2 p-8 shadow-lg ${index === 1 ? 'relative' : ''}`}
              key={plan.id}
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor:
                  index === 1
                    ? BRAND_CONFIG.brand.colors.primary
                    : BRAND_CONFIG.brand.colors.border,
              }}
            >
              {index === 1 && (
                <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                  <span
                    className="rounded-full px-4 py-1 font-medium text-sm text-white"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.primary,
                    }}
                  >
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-8 text-center">
                <h3
                  className="mb-2 font-bold text-2xl"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {plan.name}
                </h3>
                <div
                  className="mb-2 font-bold text-4xl"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {formatPrice(
                    plan.default_price,
                    plan.isRecurring,
                    plan.default_price?.recurring?.interval,
                    billingCycle
                  )}
                </div>
                <p style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                  {plan.isRecurring
                    ? `${plan.description || ''} (${plan.default_price?.recurring?.interval || 'unknown'}ly recurring)`
                    : `${plan.description || ''} (One-time)`}
                </p>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features?.map((feature, featureIndex) => (
                  <li
                    className="flex items-center"
                    key={typeof feature === 'string' ? feature : featureIndex}
                  >
                    <Check
                      className="mr-3 h-5 w-5"
                      style={{ color: BRAND_CONFIG.brand.colors.success }}
                    />
                    <span
                      style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                className="block"
                href={`/register?tier=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.default_price?.id || '')}`}
              >
                <Button
                  className="w-full"
                  size="lg"
                  variant={index === 1 ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
