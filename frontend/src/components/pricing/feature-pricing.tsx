/**
 * @file Pricing Component
 * @module Pricing
 * @description Renders a pricing table with different plans and their features.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Minus, Loader2 } from "lucide-react"
import { getProducts, type Product, type Price } from "@/app/server-actions/get-products"

// Types and Interfaces
type PricingPlan = {
  name: string
  price: string
  buttonText: string
  priceId: string
}

type Feature = {
  name: string
  [key: string]: boolean | string
}

// Constants
const CACHE_KEY = "stripePricingPlans"
const CACHE_EXPIRATION = 1000 * 60 * 60 // 1 hour in milliseconds

/**
 * @function Pricing
 * @description Renders a pricing table component with plan details and features.
 * @returns {JSX.Element} The Pricing component
 */
export default function Pricing(): JSX.Element {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true)

        // Check for cached data
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            setPlans(data.plans)
            setFeatures(data.features)
            setIsLoading(false)
            return
          }
        }

        // If no valid cache, fetch from API
        const products = await getProducts()
        const formattedPlans = formatPlans(products)
        const extractedFeatures = extractFeatures(products)

        setPlans(formattedPlans)
        setFeatures(extractedFeatures)

        // Cache the fetched data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: { plans: formattedPlans, features: extractedFeatures },
            timestamp: Date.now(),
          }),
        )
      } catch (err) {
        console.error("Error fetching plans:", err)
        setError("Failed to load pricing plans. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  /**
   * @function formatPlans
   * @description Formats the product data into pricing plans.
   * @param {Product[]} products - The array of products from the API.
   * @returns {PricingPlan[]} Formatted pricing plans.
   */
  const formatPlans = (products: Product[]): PricingPlan[] => {
    return products.map((product) => ({
      name: product.name,
      price: formatPrice(product.default_price),
      buttonText: "Get Started",
      priceId: product.default_price.id,
    }))
  }

  const formatPrice = (price: Price): string => {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency,
        minimumFractionDigits: 0,
      }).format(price.unit_amount / 100) + (price.recurring ? `/${price.recurring.interval}` : "")
    )
  }

  /**
   * @function extractFeatures
   * @description Extracts and formats features from the products.
   * @param {Product[]} products - The array of products from the API.
   * @returns {Feature[]} Extracted and formatted features.
   */
  const extractFeatures = (products: Product[]): Feature[] => {
    const allFeatures = products.flatMap((product) => product.features || [])
    const uniqueFeatures = Array.from(new Set(allFeatures))

    return uniqueFeatures.map((feature) => {
      const featureObj: Feature = { name: feature }
      products.forEach((product) => {
        featureObj[product.name.toLowerCase()] = product.features?.includes(feature) || false
      })
      return featureObj
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Compare our plans</h2>
          <p className="mt-4 text-xl text-muted-foreground">Find the perfect plan for your needs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Features</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="p-4 text-center">
                    <div className="text-2xl font-bold">{plan.name}</div>
                    <div className="mt-2 text-3xl font-bold">{plan.price}</div>
                    <div className="mt-4">
                      <Link
                        href={`/register?tier=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.priceId)}`}
                        passHref
                      >
                        <Button size="sm">{plan.buttonText}</Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b">
                  <td className="p-4 font-medium">{feature.name}</td>
                  {plans.map((plan) => (
                    <td key={`${feature.name}-${plan.name}`} className="p-4 text-center">
                      {feature[plan.name.toLowerCase()] === false ? (
                        <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                      ) : feature[plan.name.toLowerCase()] === true ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        feature[plan.name.toLowerCase()]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

