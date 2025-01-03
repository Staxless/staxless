/**
 * @file app/actions/createCheckoutSession.ts
 * @description Server action for creating a Stripe checkout session
 */

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
  productId: string,
): Promise<CheckoutResponse> {
  const headersList = headers();
  const userInfoString = headersList.get("x-user-info");

  if (!userInfoString) {
    throw new Error("User information not found");
  }

  let user: User;
  try {
    user = JSON.parse(userInfoString);
  } catch (error) {
    console.error("Error parsing user info:", error);
    throw new Error("Invalid user information");
  }

  if (!user.id) {
    throw new Error("User ID not found");
  }

  try {
    console.log(productId);
    const response = await fetch("http://stripe-service:8003/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-info": JSON.stringify({ id: user.id }),
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Stripe service error:", errorData);
      throw new Error(`Stripe service error: ${response.status}`);
    }

    const data: CheckoutResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}
