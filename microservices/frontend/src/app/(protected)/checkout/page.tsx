// src/app/(protected)/checkout/page.tsx
'use client';
import SelectionStep from '@/components/checkout/selection-step';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 font-bold text-3xl">Checkout</h1>
      <SelectionStep />
    </div>
  );
}
