import "./globals.css"
import type { Metadata } from "next"
import { siteMetadata } from "../../config"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { headers } from "next/headers"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import React from 'react'; // Import React

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500"], // Regular and Medium weights
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: "400", // Regular weight
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `Home | ${siteMetadata.title}`,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.siteName,
  },
  twitter: {
    card: "summary_large_image",
    site: siteMetadata.social.twitter,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

async function getUserInfo() {
  const headersList = await headers()
  const userInfoString = headersList.get("x-user-info")
  return userInfoString ? JSON.parse(userInfoString) : null
}

export default async function RootLayout({ children }: RootLayoutProps): Promise<JSX.Element> {
  const user = await getUserInfo()

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className={`flex flex-col min-h-screen ${spaceGrotesk.className}`}>
        <ThemeProvider>
          <main className="flex-grow">{React.cloneElement(children as React.ReactElement, { user })}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
