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
import { useTheme } from "@/contexts/ThemeContext"
import { motion } from "framer-motion"
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
  const colors = useTheme()
  const formattedPrice = formatPrice(plan.default_price)

  return (
    <div
      className="flex flex-col p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: colors.secondary, borderColor: `${colors.primary}1A`, borderWidth: "1px" }}
    >
      <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
        {plan.name}
      </h3>
      <p className="mt-2 text-sm" style={{ color: colors.muted }}>
        {plan.description}
      </p>
      <div className="mt-4 text-4xl font-bold" style={{ color: colors.text }}>
        {formattedPrice}
        <span className="text-base font-normal" style={{ color: colors.muted }}>
          {plan.name !== "Enterprise" && " one-time"}
        </span>
      </div>
      <ul className="mt-6 space-y-4 flex-grow">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 mr-2" style={{ color: colors.primary }} />
            <span style={{ color: colors.text }}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/register?tier=${encodeURIComponent(
          plan.name,
        )}&price=${encodeURIComponent(plan.default_price?.id || "")}`}
        passHref
      >
        <Button
          className="mt-8 w-full"
          size="lg"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
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
  const colors = useTheme()

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
      <div className="flex justify-center items-center h-96" style={{ backgroundColor: colors.background }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4" style={{ backgroundColor: colors.background, color: colors.primary }}>
        <p>{error}</p>
      </div>
    )
  }

    return (
      <section id="pricing" className="py-20 bg-[color:var(--color-accent)] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className="border border-[color:var(--color-primary)] rounded-lg p-6 flex flex-col bg-[color:var(--color-background)] shadow-lg hover:shadow-[color:var(--color-primary)]/20 transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{formatPrice(plan.default_price)}</p>
                <ul className="mb-8 flex-grow">
                  {plan.features?.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 mr-2 text-[color:var(--color-primary)]" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Button
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  border: `2px solid ${colors.text}`,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
                className="px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background
                  e.currentTarget.style.color = colors.primary
                  e.currentTarget.style.transform = "translate(2px, 2px)"
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px rgba(0,0,0,1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary
                  e.currentTarget.style.color = colors.background
                  e.currentTarget.style.transform = "translate(0, 0)"
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
                }}
              >
                Choose Plan
              </Button>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-code-pattern opacity-5" />
      </section>
    )
}

