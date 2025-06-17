"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { getProducts, type Product } from "@/app/actions/get-products"
import { BRAND_CONFIG } from "@/lib/brand-config"

const formatPrice = (price: any) => {
  if (!price) return "Contact us"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format(price.unit_amount / 100)
}

export default function Pricing() {
  const [plans, setPlans] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const products = await getProducts()
        setPlans(products)
      } catch (error) {
        console.error("Error fetching plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (isLoading) {
    return (
      <section id="pricing" className="py-20" style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}>
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
            Loading pricing...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20" style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            {BRAND_CONFIG.content.pricing.title}
          </h2>
          <p className="text-xl" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
            {BRAND_CONFIG.content.pricing.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg border-2 p-8 ${index === 1 ? "relative" : ""}`}
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: index === 1 ? BRAND_CONFIG.brand.colors.primary : BRAND_CONFIG.brand.colors.border,
              }}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}
                  >
                    Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                  {formatPrice(plan.default_price)}
                </div>
                <p style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 mr-3" style={{ color: BRAND_CONFIG.brand.colors.success }} />
                    <span style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/register?tier=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.default_price?.id || "")}`}
                className="block"
              >
                <Button className="w-full" variant={index === 1 ? "default" : "outline"} size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
