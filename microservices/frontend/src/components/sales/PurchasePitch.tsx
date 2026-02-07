'use client';

import { useEffect, useState } from 'react';
import { Check, X, Shield, CreditCard, Loader2, Star, Sparkles } from 'lucide-react';
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
  const [useConfigFallback, setUseConfigFallback] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.success && result.data.length > 0) {
          setProducts(result.data);
        } else {
          setUseConfigFallback(true);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setUseConfigFallback(true);
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
      className="py-20 md:py-28"
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

        {/* Pricing Cards from Stripe */}
        {!isLoading && !useConfigFallback && products.length > 0 && (
          <div
            className={`max-w-4xl mx-auto grid gap-8 ${
              products.length === 1
                ? 'md:grid-cols-1 max-w-md'
                : products.length === 2
                ? 'md:grid-cols-2'
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
                  className={`relative rounded-2xl p-8 transition-all hover:scale-[1.02] ${
                    isPopular ? 'md:-mt-4 md:mb-4' : ''
                  }`}
                  style={{
                    backgroundColor: isPopular ? colors.background : colors.backgroundSecondary,
                    border: isPopular ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                    boxShadow: isPopular ? `0 0 40px ${colors.primary}20` : 'none',
                  }}
                >
                  {isPopular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"
                      style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    {product.name}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                    {product.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
                      {formatPrice(price)}
                    </span>
                    {interval && (
                      <span className="text-lg" style={{ color: colors.textMuted }}>
                        {interval}
                      </span>
                    )}
                  </div>

                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.success }} />
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link href={`/register?plan=${encodeURIComponent(product.name)}&price=${product.default_price?.id}`}>
                    <Button
                      className="w-full text-lg py-6 font-semibold transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: isPopular ? colors.primary : 'transparent',
                        color: isPopular ? '#FFFFFF' : colors.textPrimary,
                        border: isPopular ? 'none' : `1px solid ${colors.border}`,
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

        {/* Fallback: Pricing Cards from Config */}
        {!isLoading && useConfigFallback && purchase.packages && (
          <div
            className={`max-w-4xl mx-auto grid gap-8 ${
              purchase.packages.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
            }`}
          >
            {purchase.packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 transition-all hover:scale-[1.02] ${
                  pkg.popular ? 'md:-mt-4 md:mb-4' : ''
                }`}
                style={{
                  backgroundColor: pkg.popular ? colors.background : colors.backgroundSecondary,
                  border: pkg.popular ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                  boxShadow: pkg.popular ? `0 0 40px ${colors.primary}20` : 'none',
                }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"
                    style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}

                {/* Package Name */}
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {pkg.originalPrice && (
                    <span
                      className="text-lg line-through mr-2"
                      style={{ color: colors.textMuted }}
                    >
                      {formatPrice(pkg.originalPrice)}
                    </span>
                  )}
                  <span className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
                    {formatPrice(pkg.price)}
                  </span>
                </div>

                {/* Bonus Note */}
                {pkg.bonusNote && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg mb-4"
                    style={{ backgroundColor: `${colors.accent}15` }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
                    <span className="text-xs font-medium" style={{ color: colors.accent }}>
                      {pkg.bonusNote}
                    </span>
                  </div>
                )}

                {/* Included Features */}
                <ul className="space-y-3 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.success }} />
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Not Included Features */}
                {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                  <ul className="space-y-2 mb-6 pt-4 border-t" style={{ borderColor: colors.border }}>
                    {pkg.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.textMuted }} />
                        <span className="text-sm" style={{ color: colors.textMuted }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                <Link href={`/checkout?product=${pkg.productId || pkg.name.toLowerCase()}`}>
                  <Button
                    className="w-full text-lg py-6 font-semibold transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: pkg.popular ? colors.primary : 'transparent',
                      color: pkg.popular ? '#FFFFFF' : colors.textPrimary,
                      border: pkg.popular ? 'none' : `1px solid ${colors.border}`,
                    }}
                  >
                    {pkg.ctaText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Trust Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          {/* Payment Security */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <CreditCard className="w-5 h-5" style={{ color: colors.textMuted }} />
            <span className="text-sm" style={{ color: colors.textMuted }}>
              Secure payment powered by Stripe
            </span>
          </div>

          {/* Reminder Text */}
          <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            {purchase.reminderText}
          </p>
        </div>
      </div>
    </section>
  );
}
