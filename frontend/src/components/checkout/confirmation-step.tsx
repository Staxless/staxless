"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BRAND_CONFIG } from "@/lib/brand-config"
import { CreditCard, Check, ArrowLeft } from "lucide-react"
import type { CheckoutData } from "@/app/(protected)/checkout/page"
import { useToast } from "@/hooks/use-toast"
import { createCheckoutSession } from "@/app/actions/create-checkout-session"

interface ConfirmationStepProps {
  checkoutData: CheckoutData
  updateCheckoutData: (updates: Partial<CheckoutData>) => void
  onBack: () => void
}

export default function ConfirmationStep({ checkoutData, updateCheckoutData, onBack }: ConfirmationStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      if (!checkoutData.selectedPlan?.id) {
        throw new Error("No plan selected")
      }

      const { url } = await createCheckoutSession(checkoutData.selectedPlan.id)
      window.location.href = url // Redirect to Stripe checkout
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: "Failed to proceed to payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className="border"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
        borderColor: BRAND_CONFIG.brand.colors.border,
      }}
    >
      <CardHeader>
        <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Order Confirmation</CardTitle>
        <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
          Review your order details before proceeding to payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            Plan Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                {checkoutData.selectedPlan?.name} ({checkoutData.billingCycle})
              </span>
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                ${checkoutData.subtotal.toFixed(2)}
              </span>
            </div>
            {checkoutData.discount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: BRAND_CONFIG.brand.colors.primary }}>
                  Discount ({checkoutData.promoCode})
                </span>
                <span style={{ color: BRAND_CONFIG.brand.colors.primary }}>
                  -${(checkoutData.subtotal * checkoutData.discount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>Tax (8%)</span>
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                ${checkoutData.tax.toFixed(2)}
              </span>
            </div>
            <Separator style={{ backgroundColor: BRAND_CONFIG.brand.colors.border }} />
            <div className="flex justify-between font-semibold">
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Total</span>
              <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                ${checkoutData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            Customer Information
          </h3>
          <div className="space-y-2">
            <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              {checkoutData.firstName} {checkoutData.lastName}
            </p>
            <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>{checkoutData.email}</p>
            {checkoutData.phone && (
              <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>{checkoutData.phone}</p>
            )}
            {checkoutData.companyName && (
              <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                {checkoutData.companyName}
                {checkoutData.taxId && `, Tax ID: ${checkoutData.taxId}`}
              </p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input type="checkbox" id="terms" className="mt-1" required />
          <label htmlFor="terms" className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            I agree to the{" "}
            <a
              href="/legal/terms"
              className="hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/legal/privacy"
              className="hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border"
            style={{
              backgroundColor: "transparent",
              borderColor: BRAND_CONFIG.brand.colors.border,
              color: BRAND_CONFIG.brand.colors.textPrimary,
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 text-lg font-semibold"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.primary,
              color: "white",
            }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Payment</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}