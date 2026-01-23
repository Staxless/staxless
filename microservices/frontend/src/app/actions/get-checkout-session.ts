/**
 * @file app/actions/get-checkout-session.ts
 * @description Server action for retrieving Stripe checkout session details
 */

'use server';

import { headers } from 'next/headers';
import {
  type ActionResult,
  success,
  failure,
  safeFetch,
  logError,
} from '@/lib/error-handling';

export interface CheckoutSessionData {
  id: string;
  planName: string;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  nextBillingDate: number | null;
  customerEmail: string | null;
  status: string | null;
  paymentStatus: string | null;
}

/**
 * Retrieves checkout session details from Stripe
 * @param {string} sessionId - The Stripe checkout session ID
 * @returns {Promise<ActionResult<CheckoutSessionData>>} The checkout session details
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<ActionResult<CheckoutSessionData>> {
  try {
    if (!sessionId) {
      return failure('Session ID is required');
    }

    const headersList = await headers();
    const userInfoString = headersList.get('x-user-info');
    const cookie = headersList.get('cookie')?.split('; ');
    const auth_session = cookie?.find((c) => c.startsWith('auth_session='));

    if (!userInfoString) {
      logError(new Error('User information not found'), { sessionId });
      return failure('User information not found. Please log in again.');
    }

    const data = await safeFetch<CheckoutSessionData>(
      `http://kong-api-gateway:8000/checkout/session/${encodeURIComponent(sessionId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-info': userInfoString,
          Cookie: `${auth_session}`,
        },
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { sessionId, action: 'getCheckoutSession' });
    return failure('Failed to retrieve checkout session details.');
  }
}
