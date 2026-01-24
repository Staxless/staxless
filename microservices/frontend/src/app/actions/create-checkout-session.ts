/**
 * @file app/actions/createCheckoutSession.ts
 * @description Server action for creating a Stripe checkout session
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
import { getApiGatewayUrl } from '@/lib/api-config';

interface User {
  id: string;
  // Add other user properties as needed
}

interface CheckoutResponse {
  url: string;
}

/**
 * Creates a checkout session with Stripe
 * @param {string} productId - The ID of the product to checkout
 * @returns {Promise<ActionResult<CheckoutResponse>>} The checkout session result
 */
export async function createCheckoutSession(
  productId: string
): Promise<ActionResult<CheckoutResponse>> {
  try {
    const headersList = await headers();
    const userInfoString = headersList.get('x-user-info');
    const cookie = headersList.get('cookie')?.split('; ');
    const auth_session = cookie?.find((c) => c.startsWith('auth_session='));

    if (!userInfoString) {
      logError(new Error('User information not found'), { productId });
      return failure('User information not found. Please log in again.');
    }

    let user: User;
    try {
      user = JSON.parse(userInfoString);
    } catch (error) {
      logError(error, { productId, userInfoString });
      return failure('Invalid user information. Please log in again.');
    }

    if (!user.id) {
      logError(new Error('User ID not found'), { productId, user });
      return failure('User ID not found. Please log in again.');
    }

    const data = await safeFetch<CheckoutResponse>(
      `${getApiGatewayUrl()}/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-info': JSON.stringify({ id: user.id }),
          Cookie: `${auth_session}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      }
    );

    return success(data);
  } catch (error) {
    logError(error, { productId, action: 'createCheckoutSession' });
    return failure('Failed to create checkout session. Please try again.');
  }
}
