/**
 * @file app/actions/createCheckoutSession.ts
 * @description Server action for creating a Stripe checkout session
 */

'use server';

import { headers } from 'next/headers';

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
 * @returns {Promise<CheckoutResponse>} The checkout session URL
 * @throws {Error} If user information is not found or if checkout session creation fails
 */
export async function createCheckoutSession(
  productId: string
): Promise<CheckoutResponse> {
  const headersList = await headers();
  const userInfoString = headersList.get('x-user-info');
  const cookie = headersList.get('cookie')?.split('; ');
  const auth_session = cookie?.find((c) => c.startsWith('auth_session='));

  if (!userInfoString) {
    throw new Error('User information not found');
  }

  let user: User;
  try {
    user = JSON.parse(userInfoString);
  } catch {
    throw new Error(`Invalid user information: ${userInfoString}`);
  }

  if (!user.id) {
    throw new Error('User ID not found');
  }

  try {
    const response = await fetch('http://kong-api-gateway:8000/checkout', {
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
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Stripe service error: ${response.status} - ${errorData}`
      );
    }

    const data: CheckoutResponse = await response.json();
    return data;
  } catch {
    throw new Error('Failed to create checkout session');
  }
}
