'use client';

import { useEffect, useState } from 'react';
import { Check, Shield, CreditCard, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';
import { getSalesSection, formatPrice } from '@config/sales-config';
import { getProducts, type Product } from '@/app/actions/get-products';

export default function PurchasePitch() {
  const colors = BRAND_CONFIG.brand.colors;
  const purchase = getSalesSection('purchasePitch');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductPrice = (product: Product): number => {
    return (product.default_price?.unit_amount || 0) / 100;
  };

  const getInterval = (product: Product): string => {
    if (!product.isRecurring) return '';
    const interval = product.default_price?.recurring?.interval;
    return interval === 'month' ? '/mo' : '/yr';
  };

  return (
    <section
      id="pricing"
      className="py-20"
      style={{
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundSecondary} 50%, ${colors.background} 100%)`,
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {purchase.headline}
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            {purchase.subheadline}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        )}

        {/* Pricing Cards */}
        {!isLoading && products.length > 0 && (
          <div
            className={`max-w-5xl mx-auto grid gap-6 ${
              products.length === 1
                ? 'md:grid-cols-1 max-w-md'
                : products.length === 2
                ? 'md:grid-cols-2 max-w-3xl'
                : 'md:grid-cols-3'
            }`}
          >
            {products.map((product, index) => {
              const isPopular = index === 1 && products.length > 1;
              const price = getProductPrice(product);
              const interval = getInterval(product);

              return (
                <div
                  key={product.id}
                  className={`relative rounded-2xl p-6 transition-all hover:scale-[1.02] ${
                    isPopular ? 'md:-mt-4 md:mb-4' : ''
                  }`}
                  style={{
                    backgroundColor: isPopular
                      ? colors.background
                      : colors.backgroundSecondary,
                    border: isPopular
                      ? `2px solid ${colors.primary}`
                      : `1px solid ${colors.border}`,
                    boxShadow: isPopular
                      ? `0 0 40px ${colors.primary}20`
                      : 'none',
                  }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </div>
                  )}

                  {/* Product Name */}
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm mb-4"
                    style={{ color: colors.textMuted }}
                  >
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {formatPrice(price)}
                    </span>
                    {interval && (
                      <span
                        className="text-lg"
                        style={{ color: colors.textMuted }}
                      >
                        {interval}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: colors.success }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/register?plan=${encodeURIComponent(product.name)}&price=${product.default_price?.id}&interval=${product.default_price?.recurring?.interval || 'one-time'}`}
                  >
                    <Button
                      className="w-full text-lg py-6 font-semibold transition-all"
                      style={{
                        backgroundColor: isPopular
                          ? colors.primary
                          : 'transparent',
                        color: isPopular ? colors.background : colors.textPrimary,
                        border: isPopular
                          ? 'none'
                          : `1px solid ${colors.border}`,
                      }}
                    >
                      Get {product.name}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback if no products */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: colors.textMuted }}>
              Pricing information coming soon.
            </p>
          </div>
        )}

        {/* Guarantee & Trust */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          {/* Guarantee */}
          <div
            className="flex items-center justify-center gap-3 p-4 rounded-xl mb-6"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <Shield className="w-6 h-6" style={{ color: colors.success }} />
            <p
              className="text-sm font-medium"
              style={{ color: colors.textPrimary }}
            >
              {purchase.guaranteeText}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <CreditCard className="w-6 h-6" style={{ color: colors.textMuted }} />
            <span
              className="text-sm"
              style={{ color: colors.textMuted }}
            >
              Secure payment powered by Stripe
            </span>
          </div>

          {/* Reminder */}
          <p
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            {purchase.reminderText}
          </p>
        </div>
      </div>
    </section>
  );
}
