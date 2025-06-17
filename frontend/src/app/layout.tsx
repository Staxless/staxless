import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: `Home | ${BRAND_CONFIG.seo.title}`,
  description: BRAND_CONFIG.seo.description,
  keywords: BRAND_CONFIG.seo.keywords,
  authors: [{ name: BRAND_CONFIG.company.name }],
  creator: BRAND_CONFIG.company.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND_CONFIG.company.website,
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    siteName: BRAND_CONFIG.company.name,
    images: [
      {
        url: BRAND_CONFIG.seo.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND_CONFIG.company.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    images: [BRAND_CONFIG.seo.ogImage],
    creator: BRAND_CONFIG.social.twitter,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
