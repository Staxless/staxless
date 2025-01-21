/**
 * @file TogglePricing Component
 * @module TogglePricing
 * @description A React component that displays pricing plans with toggle functionality between monthly and yearly pricing.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getProducts, type Product, type Price } from "@/app/server-actions/get-products"

// Types and Interfaces

type PricingPlan = {
  name: string
  monthlyPrice: string
  yearlyPrice: string
  description: string
  features: string[]
  buttonText: string
  monthlyPriceId: string
  yearlyPriceId: string
}

// Constants
const CACHE_KEY = "stripePricingPlans"
const CACHE_EXPIRATION = 1000 * 60 * 60 // 1 hour in milliseconds

/**
 * @function TogglePricing
 * @description Renders a pricing section with toggle functionality between monthly and yearly pricing.
 * @returns {JSX.Element} The TogglePricing component
 */
export default function TogglePricing(): JSX.Element {
  const [isYearly, setIsYearly] = useState(false)
  const [plans, setPlans] = useState<PricingPlan[]>([])
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
            setPlans(data)
            setIsLoading(false)
            return
          }
        }

        // If no valid cache, fetch from API
        const products = await getProducts()
        const formattedPlans = formatPlans(products)

        setPlans(formattedPlans)

        // Cache the fetched data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: formattedPlans,
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
   * @description Formats the product data into pricing plans
   * @param {Product[]} products - Array of products
   * @returns {PricingPlan[]} Formatted pricing plans
   */
  const formatPlans = (products: Product[]): PricingPlan[] => {
    return products.map((product) => {
      const monthlyPrice = product.default_price.recurring?.interval === "month" ? product.default_price : null
      const yearlyPrice = product.default_price.recurring?.interval === "year" ? product.default_price : null

      return {
        name: product.name,
        monthlyPrice: formatPrice(monthlyPrice),
        yearlyPrice: formatPrice(yearlyPrice),
        description: product.description,
        features: product.features || [],
        buttonText: product.name === "Enterprise" ? "Contact Sales" : `Get ${product.name}`,
        monthlyPriceId: monthlyPrice?.id || "",
        yearlyPriceId: yearlyPrice?.id || "",
      }
    })
  }

  /**
   * @function formatPrice
   * @description Formats the price for display
   * @param {Price | null} price - Price object
   * @returns {string} Formatted price string
   */
  const formatPrice = (price: Price | null): string => {
    if (!price) return "Custom"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format(price.unit_amount / 100)
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
          <h2 className="text-3xl font-bold">Flexible plans for every need</h2>
          <p className="mt-4 text-xl text-muted-foreground">Choose the perfect plan for your business</p>
          <div className="mt-8 flex items-center justify-center">
            <span className={`mr-3 ${isYearly ? "text-muted-foreground" : "font-semibold"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`ml-3 ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Yearly (Save 20%)</span>
          </div>
        </div>
        {plans.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="flex flex-col p-6 bg-card rounded-lg shadow-lg border border-primary/10">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 text-4xl font-bold">
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  <span className="text-base font-normal text-muted-foreground">
                    {plan.name !== "Enterprise" && (isYearly ? "/year" : "/month")}
                  </span>
                </div>
                <ul className="mt-6 space-y-4 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/register?tier=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(isYearly ? plan.yearlyPriceId : plan.monthlyPriceId)}`}
                  passHref
                >
                  <Button className="mt-8 w-full" size="lg">
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-yellow-500 p-4">
            <p>No pricing plans are currently available.</p>
          </div>
        )}
      </div>
    </section>
  )
}

