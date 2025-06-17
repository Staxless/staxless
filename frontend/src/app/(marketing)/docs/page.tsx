"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import {
  Search,
  Book,
  Code,
  CreditCard,
  Settings,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  Star,
} from "lucide-react"
import Link from "next/link"

const quickStartSteps = [
  {
    step: "01",
    title: "Installation",
    description: "Get started with our CLI tool or download the template",
    time: "2 min",
  },
  {
    step: "02",
    title: "Configuration",
    description: "Set up your environment variables and database",
    time: "5 min",
  },
  {
    step: "03",
    title: "Customization",
    description: "Brand your application and configure features",
    time: "10 min",
  },
  {
    step: "04",
    title: "Deploy",
    description: "Launch your SaaS application to production",
    time: "3 min",
  },
]

const featuredGuides = [
  {
    title: "Authentication Setup",
    description: "Complete guide to setting up OAuth and magic links",
    category: "Security",
    readTime: "15 min",
    difficulty: "Intermediate",
    href: "/docs/auth/setup",
  },
  {
    title: "Payment Integration",
    description: "Integrate Stripe payments and subscription billing",
    category: "Payments",
    readTime: "20 min",
    difficulty: "Advanced",
    href: "/docs/payments/stripe",
  },
  {
    title: "Custom Branding",
    description: "White-label your application with custom themes",
    category: "Design",
    readTime: "12 min",
    difficulty: "Beginner",
    href: "/docs/customization/branding",
  },
]

const apiEndpoints = [
  { method: "GET", endpoint: "/api/users", description: "Fetch user data" },
  { method: "POST", endpoint: "/api/auth/login", description: "User authentication" },
  { method: "POST", endpoint: "/api/payments/checkout", description: "Create checkout session" },
  { method: "GET", endpoint: "/api/subscriptions", description: "Manage subscriptions" },
]

export default function DocsPage() {
  return (
    <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
      <Header user={null} />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 border-b" style={{ borderColor: BRAND_CONFIG.brand.colors.border }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div
                  className="p-4 rounded-full"
                  style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
                >
                  <Book className="h-12 w-12" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                </div>
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Documentation
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                Everything you need to build, customize, and scale your SaaS application
              </p>

              {/* Search Bar */}
              <div className="max-w-lg mx-auto relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  placeholder="Search documentation..."
                  className="pl-12 py-4 text-lg border-2 rounded-xl"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <Card
                  key={index}
                  className="border-2 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-3xl font-bold opacity-30"
                        style={{ color: BRAND_CONFIG.brand.colors.primary }}
                      >
                        {step.step}
                      </span>
                      <span
                        className="text-sm px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                          color: BRAND_CONFIG.brand.colors.primary,
                        }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      {step.title}
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Featured Guides */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    Featured Guides
                  </h2>
                  <Link href="/docs/guides">
                    <Button
                      variant="outline"
                      className="border"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                    >
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-6">
                  {featuredGuides.map((guide, index) => (
                    <Link key={index} href={guide.href}>
                      <Card
                        className="border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                          borderColor: BRAND_CONFIG.brand.colors.border,
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span
                                  className="text-sm px-3 py-1 rounded-full font-medium"
                                  style={{
                                    backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                                    color: BRAND_CONFIG.brand.colors.primary,
                                  }}
                                >
                                  {guide.category}
                                </span>
                                <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                                  {guide.readTime}
                                </span>
                                <div className="flex items-center">
                                  {[
                                    ...Array(
                                      guide.difficulty === "Beginner" ? 1 : guide.difficulty === "Intermediate" ? 2 : 3,
                                    ),
                                  ].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 fill-current"
                                      style={{ color: BRAND_CONFIG.brand.colors.primary }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                              >
                                {guide.title}
                              </h3>
                              <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>{guide.description}</p>
                            </div>
                            <ChevronRight
                              className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              {/* API Reference */}
              <section>
                <h2 className="text-3xl font-bold mb-8" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                  API Reference
                </h2>
                <Card
                  className="border-2"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardHeader>
                    <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Popular Endpoints</CardTitle>
                    <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Most commonly used API endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiEndpoints.map((endpoint, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border"
                          style={{
                            backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                            borderColor: BRAND_CONFIG.brand.colors.border,
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <span
                              className="px-2 py-1 text-xs font-mono rounded"
                              style={{
                                backgroundColor: endpoint.method === "GET" ? "#10b98120" : "#f59e0b20",
                                color: endpoint.method === "GET" ? "#10b981" : "#f59e0b",
                              }}
                            >
                              {endpoint.method}
                            </span>
                            <code
                              className="font-mono text-sm"
                              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                            >
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                            {endpoint.description}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/docs/api">
                        <Button
                          className="w-full"
                          style={{
                            backgroundColor: BRAND_CONFIG.brand.colors.primary,
                            color: "white",
                          }}
                        >
                          View Full API Documentation
                          <Code className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card
                className="border-2"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/api-keys">
                    <Button
                      variant="outline"
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      API Keys
                    </Button>
                  </Link>
                  <Link href="/dashboard/billing">
                    <Button
                      variant="outline"
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button
                      variant="outline"
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card
                className="border-2"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <HelpCircle className="h-12 w-12 mx-auto" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                    <h3 className="font-semibold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                      Need Help?
                    </h3>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Our support team is here to help you get the most out of your SaaS application.
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.primary,
                          color: "white",
                        }}
                      >
                        Contact Support
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: BRAND_CONFIG.brand.colors.border,
                          color: BRAND_CONFIG.brand.colors.textPrimary,
                        }}
                      >
                        Join Community
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card
                className="border-2"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link
                      href="/changelog"
                      className="flex items-center justify-between p-2 rounded hover:bg-opacity-50 transition-colors"
                      style={{ backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30` }}
                    >
                      <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                        Changelog
                      </span>
                      <ExternalLink className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.textMuted }} />
                    </Link>
                    <Link
                      href="/status"
                      className="flex items-center justify-between p-2 rounded hover:bg-opacity-50 transition-colors"
                      style={{ backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30` }}
                    >
                      <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                        System Status
                      </span>
                      <ExternalLink className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.textMuted }} />
                    </Link>
                    <Link
                      href="/roadmap"
                      className="flex items-center justify-between p-2 rounded hover:bg-opacity-50 transition-colors"
                      style={{ backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30` }}
                    >
                      <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                        Roadmap
                      </span>
                      <ExternalLink className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.textMuted }} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
