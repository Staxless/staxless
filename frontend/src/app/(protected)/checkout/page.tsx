"use client"

import { useState, useEffect } from "react"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getProducts, type Product } from "@/app/actions/get-products"
import SelectionStep from "@/components/checkout/selection-step"
import ConfirmationStep from "@/components/checkout/confirmation-step"

export interface CheckoutData {
  // Plan Selection
  selectedPlan: Product | null
  billingCycle: "monthly" | "yearly"

  // Customer Information
  firstName: string
  lastName: string
  email: string
  phone: string

  // Company Information (optional)
  companyName: string
  taxId: string

  // Pricing
  subtotal: number
  discount: number
  tax: number
  total: number
  promoCode: string
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedPlan: null,
    billingCycle: "monthly",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    taxId: "",
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    promoCode: "",
  })

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const products = await getProducts()
        const tierParam = searchParams.get("tier")
        let selectedPlan = products[1] // Default to second plan (e.g., Pro)

        if (tierParam) {
          const plan = products.find((p) => p.name.toLowerCase() === tierParam.toLowerCase())
          if (plan) {
            selectedPlan = plan
            setCurrentStep(2) // Skip to confirmation if tier is specified
          }
        }

        setCheckoutData((prev) => ({
          ...prev,
          selectedPlan,
          subtotal: selectedPlan?.default_price?.unit_amount
            ? selectedPlan.default_price.unit_amount / 100
            : 0,
        }))
      } catch (error) {
        console.error("Error initializing checkout:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCheckout()
  }, [searchParams])

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData((prev) => {
      const newData = { ...prev, ...updates }
      const subtotal = newData.selectedPlan?.default_price?.unit_amount
        ? newData.selectedPlan.default_price.unit_amount / 100
        : prev.subtotal
      const discountAmount = subtotal * (newData.discount || 0)
      const tax = (subtotal - discountAmount) * 0.08 // 8% tax
      const total = subtotal - discountAmount + tax
      return { ...newData, subtotal, tax, total }
    })
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelectionNext = (data: any) => {
    updateCheckoutData({
      selectedPlan: data.plan,
      billingCycle: data.billingCycle,
      firstName: data.customerInfo.name.split(" ")[0] || "",
      lastName: data.customerInfo.name.split(" ")[1] || "",
      email: data.customerInfo.email,
      subtotal: data.pricing.basePrice,
      discount: data.pricing.discount / data.pricing.basePrice,
      total: data.pricing.finalPrice,
      promoCode: data.promoCode || "",
    })
    nextStep()
  }

  if (isLoading) {
    return (
      <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
        <Header user={null} />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
      <Header user={null} />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/#pricing" className="flex items-center space-x-1 hover:underline text-gray-600">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Pricing</span>
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className={`text-sm ${currentStep >= 1 ? "text-black font-medium" : "text-gray-500"}`}>
                  Plan Selection
                </span>
              </div>

              <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-black" : "bg-gray-200"}`}></div>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className={`text-sm ${currentStep >= 2 ? "text-black font-medium" : "text-gray-500"}`}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <SelectionStep
              onNext={handleSelectionNext}
            />
          )}

          {currentStep === 2 && (
            <ConfirmationStep
              checkoutData={checkoutData}
              updateCheckoutData={updateCheckoutData}
              onBack={prevStep}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}