"use client"
import Link from "next/link"
import {X, Github } from "lucide-react"
import StaxlessBadge from "@/components/shared/staxless-badge"
import { siteConfig } from "../../../config"

/**
 * Footer - The footer component for the application.
 * This component displays the footer with company info, quick links, resources, legal links,
 * and social media icons.
 *
 * @returns {JSX.Element} A footer layout with all sections.
 */

export default function Footer() {
  return (
    <footer className="bg-muted w-full">
      <div className="container px-4 py-10 md:py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center text-center">
          {/* Company Info */}
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">Creating innovative solutions for a better tomorrow.</p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">X</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/legal/about" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-bold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/license" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container px-4 py-6 max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <StaxlessBadge />
        </div>
      </div>
    </footer>
  )
}

