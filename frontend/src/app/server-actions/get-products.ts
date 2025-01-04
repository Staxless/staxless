/**
 * @file app/actions/getProducts.ts
 * @description Server action for fetching and sorting products from the Stripe service
 */

"use server";

import { cache } from "react";

/**
 * Represents a price object for a product
 */
export interface Price {
  id: string;
  currency: string;
  unit_amount: number;
  recurring?: {
    interval: string;
  };
}

/**
 * Represents a product object
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  default_price: Price;
  features: string[];
}

/**
 * Fetches and sorts products from the Stripe service
 * @returns {Promise<Product[]>} A promise that resolves to an array of sorted products
 * @throws {Error} If there's an error fetching the products
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  const apiUrl = process.env.API_URL || "http://stripe-service:8003";

  try {
    const response = await fetch(`${apiUrl}/products`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products: Product[] = await response.json();

    // Sort products by price (ascending order)
    products.sort((a, b) => {
      const priceA = a.default_price?.unit_amount ?? 0;
      const priceB = b.default_price?.unit_amount ?? 0;
      return priceA - priceB;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
});
