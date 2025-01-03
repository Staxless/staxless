/**
 * @file app/checkout/page.tsx
 * @description Checkout page component for handling user authentication and displaying the multi-step form.
 */

import { headers } from "next/headers";
import MultiStepForm from "@/components/checkout/multi-step-form";
import { getStoredPlanSelection } from "@/app/actions/getStoredPlanSelection";

/**
 * CheckoutPage component
 * @returns {JSX.Element} The rendered checkout page
 */
export default async function CheckoutPage() {
  const headersList = headers();
  const userInfoString = headersList.get("x-user-info");
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to access the checkout process.</p>
        </div>
      </div>
    );
  }

  const { tier, priceId } = await getStoredPlanSelection();

  return <MultiStepForm initialTier={tier} initialPriceId={priceId} />;
}
