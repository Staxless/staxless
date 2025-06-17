"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { ArrowLeft, FileText, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getPolicyContent } from "@/content/policy-content"

export default function PolicyPage() {
  const params = useParams()
  const slug = params.slug as string
  const policy = getPolicyContent(slug)

  if (!policy) {
    return (
      <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
        <Header user={null} />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Policy Not Found
            </h1>
            <p className="mb-8" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              The requested policy page could not be found.
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center space-x-2 hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Legal</span>
            </Link>
          </div>
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
            <Link
              href="/legal"
              className="flex items-center space-x-1 hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Legal</span>
            </Link>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>/</span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>{policy.title}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary }}
              >
                <FileText className="h-6 w-6" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
              </div>
              <h1 className="text-4xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                {policy.title}
              </h1>
            </div>

            <div className="flex items-center space-x-6 text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Effective: {policy.effectiveDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Last updated: {policy.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card
            className="border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                {policy.content.map((section, index) => (
                  <div key={index} className="mb-8">
                    {section.type === "heading" && (
                      <h2
                        className="text-2xl font-bold mb-4 mt-8 first:mt-0"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {section.content}
                      </h2>
                    )}
                    {section.type === "subheading" && (
                      <h3
                        className="text-xl font-semibold mb-3 mt-6"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {section.content}
                      </h3>
                    )}
                    {section.type === "paragraph" && (
                      <p className="mb-4 leading-relaxed" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                        {section.content}
                      </p>
                    )}
                    {section.type === "list" && (
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        {section.items?.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.type === "numbered-list" && (
                      <ol className="list-decimal pl-6 mb-4 space-y-2">
                        {section.items?.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                            {item}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card
            className="mt-8 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Questions about this policy?
              </h3>
              <p className="mb-4" style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}>
                If you have any questions about this {policy.title.toLowerCase()}, please contact us:
              </p>
              <div className="space-y-2 text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                <p>Email: {BRAND_CONFIG.company.email}</p>
                <p>Address: {BRAND_CONFIG.company.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
