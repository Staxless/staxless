/**
 * @file app/actions/getProducts.ts
 * @description Server action for fetching and sorting products from the Stripe service
 */
'use server';
export interface RecurringPrice {
  interval: 'day' | 'week' | 'month' | 'year';
}

export interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring?: RecurringPrice;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  default_price: Price;
  images: string[];
  features?: string[];
  isRecurring: boolean; // Added to indicate recurring or one-time payment
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://front-gate:8000/products', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const products: Product[] = await response.json();

  if (!Array.isArray(products)) {
    throw new Error('Invalid response format: products data is not an array');
  }

  // Map products to include isRecurring property
  const processedProducts = products.map((product) => ({
    ...product,
    isRecurring: !!product.default_price.recurring,
  }));

  // Sort products: recurring first, then by price (ascending)
  processedProducts.sort((a, b) => {
    // Prioritize recurring payments
    if (a.isRecurring && !b.isRecurring) {
      return -1;
    }
    if (!a.isRecurring && b.isRecurring) {
      return 1;
    }

    // If both have same payment type, sort by price
    const priceA = a.default_price?.unit_amount ?? 0;
    const priceB = b.default_price?.unit_amount ?? 0;
    return priceA - priceB;
  });

  return processedProducts;
};
