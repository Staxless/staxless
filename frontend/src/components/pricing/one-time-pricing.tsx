/**
 * @file OneTimePricing Component
 * @module OneTimePricing
 * @description A React component that displays one-time pricing plans.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { getProducts, type Product, type Price } from "@/app/server-actions/get-products"

// Constants
const CACHE_KEY = "pricingPlans"
const CACHE_EXPIRATION = 1000 * 60 * 60 // 1 hour in milliseconds

const formatPrice = (price: Price | undefined): string => {
  if (!price) return "Price not available"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format(price.unit_amount / 100)
}

const PricingCard = ({ plan }: { plan: Product }) => {
  const formattedPrice = formatPrice(plan.default_price)

  return (
    <div className="flex flex-col p-6 bg-card rounded-lg shadow-lg border border-primary/10">
      <h3 className="text-2xl font-bold">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      <div className="mt-4 text-4xl font-bold">
        {formattedPrice}
        <span className="text-base font-normal text-muted-foreground">{plan.name !== "Enterprise" && " one-time"}</span>
      </div>
      <ul className="mt-6 space-y-4 flex-grow">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/register?tier=${encodeURIComponent(
          plan.name,
        )}&price=${encodeURIComponent(plan.default_price?.id || "")}`}
        passHref
      >
        <Button className="mt-8 w-full" size="lg">
          {plan.name === "Enterprise" ? "Contact Sales" : `Get ${plan.name}`}
        </Button>
      </Link>
    </div>
  )
}

/**
 * @function OneTimePricing
 * @description Renders a pricing section with one-time pricing plans.
 * @returns {JSX.Element} The OneTimePricing component
 */
export default function OneTimePricing(): JSX.Element {
  const [plans, setPlans] = useState<Product[]>([])
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
        console.log("Products fetched:", products)
        setPlans(products)

        // Cache the fetched data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: products,
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
          <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-xl text-muted-foreground">Choose the plan thats right for you</p>
        </div>
        {plans.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
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

