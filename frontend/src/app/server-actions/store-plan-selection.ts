/**
 * @file app/actions/storePlanSelection.ts
 * @description Server action for storing plan selection data in cookies
 */

"use server";

import { cookies } from "next/headers";

/**
 * Stores the selected plan tier and price ID in cookies
 * @param {string} tier - The selected plan tier
 * @param {string} priceId - The selected price ID
 * @returns {Promise<void>}
 */
export async function storePlanSelection(
  tier: string,
  priceId: string,
): Promise<void> {
  cookies().set("selectedTier", tier, { httpOnly: true, secure: true });
  cookies().set("selectedPriceId", priceId, { httpOnly: true, secure: true });
}
