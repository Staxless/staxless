/**
 * @file app/actions/getStoredPlanSelection.ts
 * @description Server action for retrieving stored plan selection data from cookies
 */

"use server";

import { cookies } from "next/headers";

/**
 * Retrieves the stored plan selection data from cookies
 * @returns {Promise<{tier?: string, priceId?: string}>} An object containing the selected tier and price ID
 */
export async function getStoredPlanSelection() {
  const tier = cookies().get("selectedTier")?.value;
  const priceId = cookies().get("selectedPriceId")?.value;

  return { tier, priceId };
}
