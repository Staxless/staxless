"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BRAND_CONFIG } from "@/lib/brand-config"
import { Check, User, Mail, Tag, CreditCard } from "lucide-react"
import { getProducts, type Product } from "@/app/actions/get-products"

interface SelectionStepProps {
  onNext: (data: any) => void
}

export default function SelectionStep({ onNext }: SelectionStepProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
  })
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
        setSelectedPlanId(fetchedProducts[1]?.id || "") // Default to second plan
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const selectedPlan = products.find((p) => p.id === selectedPlanId)
  const basePrice = selectedPlan?.default_price?.unit_amount
    ? selectedPlan.default_price.unit_amount / 100
    : 0
  const discount = promoApplied ? basePrice * 0.1 : 0
  const finalPrice = basePrice - discount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true)
    }
  }

  const handleNext = () => {
    if (!selectedPlan) return
    onNext({
      plan: selectedPlan,
      billingCycle,
      customerInfo,
      pricing: {
        basePrice,
        discount,
        finalPrice,
      },
      promoCode: promoApplied ? promoCode : null,
    })
  }

  const isFormValid = customerInfo.name && customerInfo.email

  if (isLoading || !products.length) {
    return <div>Loading plans...</div>
  }

  return (
    <div className="space-y-8">
      {/* Plan Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
          Choose Your Plan
        </h2>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge className="ml-2 text-xs" style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}>
                  Save 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 cursor-pointer transition-all duration-200 ${
                selectedPlanId === plan.id ? "ring-2" : ""
              }`}
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor:
                  selectedPlanId === plan.id ? BRAND_CONFIG.brand.colors.primary : BRAND_CONFIG.brand.colors.border,
                ringColor: BRAND_CONFIG.brand.colors.primary,
              }}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <CardHeader className="text-center">
                <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>{plan.name}</CardTitle>
                <div className="text-3xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                  ${plan.default_price?.unit_amount ? (plan.default_price.unit_amount / 100).toFixed(2) : "0"}
                  <span className="text-sm font-normal" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {plan.images?.[0] && (
                  <img
                    src={plan.images[0]}
                    alt={plan.name}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />
                )}
                <p className="text-sm mb-4" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                      <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                        {feature}
                      </span>
                    </li>
                  )) || <li>No features listed</li>}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Customer Information */}
      <Card
        className="border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Your Information</CardTitle>
          <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            We'll use this to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Full Name *
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-10 border"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Email Address *
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card
        className="border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Promo Code</CardTitle>
          <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            Have a discount code? Apply it here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Tag
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="pl-10 border"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
                placeholder="Enter promo code"
                disabled={promoApplied}
              />
            </div>
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode || promoApplied}
              variant="outline"
              className="border"
              style={{
                backgroundColor: promoApplied ? BRAND_CONFIG.brand.colors.primary : "transparent",
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: promoApplied ? "white" : BRAND_CONFIG.brand.colors.textPrimary,
              }}
            >
              {promoApplied ? "Applied" : "Apply"}
            </Button>
          </div>
          {promoApplied && (
            <p className="text-sm mt-2" style={{ color: BRAND_CONFIG.brand.colors.primary }}>
              ✓ 10% discount applied!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card
        className="border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              {selectedPlan?.name} ({billingCycle})
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>${basePrice.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between">
              <span style={{ color: BRAND_CONFIG.brand.colors.primary }}>Discount (10%)</span>
              <span style={{ color: BRAND_CONFIG.brand.colors.primary }}>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3" style={{ borderColor: BRAND_CONFIG.brand.colors.border }}>
            <div className="flex justify-between text-lg font-semibold">
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Total</span>
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button
        onClick={handleNext}
        disabled={!isFormValid}
        className="w-full py-3 text-lg font-semibold"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.primary,
          color: "white",
        }}
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Continue to Confirmation
      </Button>
    </div>
  )
}