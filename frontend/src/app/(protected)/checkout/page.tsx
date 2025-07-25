'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/app/actions/get-products';
import SelectionStep from '@/components/checkout/selection-step';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { BRAND_CONFIG } from '@/lib/brand-config';

export interface CheckoutData {
  selectedPlan: Product | null;
  billingCycle: 'monthly' | 'yearly';
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [setCheckoutData] = useState<CheckoutData>({
    selectedPlan: null,
    billingCycle: 'monthly',
  });

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const products = await getProducts();
        const tierParam = new URLSearchParams(window.location.search).get(
          'tier'
        );
        let selectedPlan = products[1]; // Default to second plan (e.g., Pro)

        if (tierParam) {
          const plan = products.find(
            (p) => p.name.toLowerCase() === tierParam.toLowerCase()
          );
          if (plan) {
            selectedPlan = plan;
          }
        }

        setCheckoutData({
          selectedPlan,
          billingCycle: 'monthly',
        });
      } catch (_error) {
        // Intentionally left blank: error is handled elsewhere or not needed
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  });

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.background,
          minHeight: '100vh',
        }}
      >
        <Header user={null} />
        <div className="flex min-h-[60vh] items-center justify-center pt-20">
          <div className="h-12 w-12 animate-spin rounded-full border-black border-b-2" />
        </div>
        <Footer />
      </div>
    );
  }

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
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center space-x-2">
            <Link
              className="flex items-center space-x-1 text-gray-600 hover:underline"
              href="/#pricing"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Pricing</span>
            </Link>
          </div>

          {/* Step Content */}
          <SelectionStep />
        </div>
      </div>

      <Footer />
    </div>
  );
}
