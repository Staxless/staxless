"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { ArrowLeft, CheckCircle, Copy, ExternalLink, Terminal, Zap } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    title: "Download & Install",
    description: "Get the SaaS starter template and install dependencies",
    code: `git clone https://github.com/yoursaas/starter.git
cd starter
npm install`,
    time: "2 minutes",
  },
  {
    title: "Environment Setup",
    description: "Configure your environment variables",
    code: `cp .env.example .env.local
# Edit .env.local with your API keys`,
    time: "3 minutes",
  },
  {
    title: "Database Setup",
    description: "Initialize your database",
    code: `npm run db:migrate
npm run db:seed`,
    time: "1 minute",
  },
  {
    title: "Start Development",
    description: "Run the development server",
    code: `npm run dev`,
    time: "30 seconds",
  },
]

const features = [
  "Authentication with OAuth",
  "Stripe payment integration",
  "User dashboard",
  "API endpoints",
  "Email notifications",
  "Dark/light theme",
]

export default function QuickStartPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
      <Header user={null} />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link
              href="/docs"
              className="flex items-center space-x-1 hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Documentation</span>
            </Link>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>/</span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>Quick Start</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
              >
                <Zap className="h-6 w-6" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
              </div>
              <h1 className="text-4xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Quick Start Guide
              </h1>
            </div>
            <p className="text-xl" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
              Get your SaaS application up and running in under 10 minutes
            </p>
          </div>

          {/* What You'll Build */}
          <Card
            className="mb-12 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>What You'll Build</CardTitle>
              <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                A complete SaaS application with the following features:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" style={{ color: BRAND_CONFIG.brand.colors.success }} />
                    <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="border"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>{step.title}</CardTitle>
                        <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-sm px-2 py-1 rounded"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                          color: BRAND_CONFIG.brand.colors.textMuted,
                        }}
                      >
                        {step.time}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative rounded-lg p-4 border"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        <Terminal className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.textMuted }} />
                        <span className="text-sm font-medium" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                          Terminal
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(step.code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <Card
            className="mt-12 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Next Steps</CardTitle>
              <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                Now that you have your SaaS running, here's what to do next:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/docs/customization/branding">
                  <div
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      Customize Your Brand
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Learn how to white-label and customize the appearance
                    </p>
                  </div>
                </Link>
                <Link href="/docs/payments/stripe">
                  <div
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      Setup Payments
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Configure Stripe for subscription billing
                    </p>
                  </div>
                </Link>
                <Link href="/docs/auth/oauth">
                  <div
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      Configure OAuth
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Set up Google, GitHub, and other OAuth providers
                    </p>
                  </div>
                </Link>
                <Link href="/docs/api/overview">
                  <div
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      Explore the API
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Learn about the REST API and integrations
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Need Help?
            </h2>
            <p className="mb-6" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              If you run into any issues, we're here to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: "white",
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Discord Community
              </Button>
              <Button
                variant="outline"
                className="border"
                style={{
                  backgroundColor: "transparent",
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
