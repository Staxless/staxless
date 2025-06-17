/**
 * @file app/actions/getProducts.ts
 * @description Server action for fetching and sorting products from the Stripe service
 */
"use server"
export interface RecurringPrice {
  interval: "day" | "week" | "month" | "year"
}

export interface Price {
  id: string
  unit_amount: number
  currency: string
  recurring?: RecurringPrice
}

export interface Product {
  id: string
  name: string
  description: string
  default_price: Price
  images: string[]
  features?: string[] // Make features optional
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`http://front-gate:8000/products`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    const products: Product[] = await response.json()

    if (!Array.isArray(products)) {
      throw new Error("Invalid response format: products data is not an array")
    }

    // Sort products by price (ascending order)
    products.sort((a, b) => {
      const priceA = a.default_price?.unit_amount ?? 0
      const priceB = b.default_price?.unit_amount ?? 0
      return priceA - priceB
    })

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}
