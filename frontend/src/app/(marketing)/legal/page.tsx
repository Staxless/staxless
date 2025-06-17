"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { FileText, Shield, Cookie, Eye, Scale, Users } from "lucide-react"
import Link from "next/link"

const legalPages = [
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    slug: "privacy",
    icon: Eye,
    lastUpdated: "December 15, 2024",
  },
  {
    title: "Terms of Service",
    description: "The terms and conditions for using our service",
    slug: "terms",
    icon: FileText,
    lastUpdated: "December 15, 2024",
  },
  {
    title: "Cookie Policy",
    description: "Information about how we use cookies and similar technologies",
    slug: "cookies",
    icon: Cookie,
    lastUpdated: "December 15, 2024",
  },
  {
    title: "Data Processing Agreement",
    description: "Our commitment to data protection and GDPR compliance",
    slug: "dpa",
    icon: Shield,
    lastUpdated: "December 15, 2024",
  },
  {
    title: "Acceptable Use Policy",
    description: "Guidelines for appropriate use of our platform",
    slug: "acceptable-use",
    icon: Users,
    lastUpdated: "December 15, 2024",
  },
  {
    title: "Service Level Agreement",
    description: "Our commitments regarding service availability and performance",
    slug: "sla",
    icon: Scale,
    lastUpdated: "December 15, 2024",
  },
]

export default function LegalPage() {
  return (
    <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
      <Header user={null} />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="flex justify-center mb-6">
              <div
                className="p-4 rounded-full"
                style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
              >
                <Scale className="h-12 w-12" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
              </div>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Legal Information
            </h1>
            <p className="text-xl mb-8" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
              Our policies and legal documents to help you understand how we operate and protect your rights
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Legal Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {legalPages.map((page, index) => (
              <Link key={index} href={`/legal/${page.slug}`}>
                <Card
                  className="border cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 h-full"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <page.icon className="h-6 w-6" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                      <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>{page.title}</CardTitle>
                    </div>
                    <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                        Updated: {page.lastUpdated}
                      </span>
                      <span
                        className="text-sm px-2 py-1 rounded"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                          color: BRAND_CONFIG.brand.colors.textMuted,
                        }}
                      >
                        View →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Contact Section */}
          <Card
            className="mt-16 max-w-2xl mx-auto border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader className="text-center">
              <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Questions About Our Policies?
              </CardTitle>
              <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                We're here to help clarify any questions you may have about our legal documents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    <p>Email: {BRAND_CONFIG.company.email}</p>
                    <p>Phone: {BRAND_CONFIG.company.phone}</p>
                    <p>Address: {BRAND_CONFIG.company.address}</p>
                  </div>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: BRAND_CONFIG.brand.colors.border }}>
                  <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    For legal matters, please allow 2-3 business days for a response
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
