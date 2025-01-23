/**
 * @file app/layout.tsx
 * @description Root layout component for the Next.js application
 */

import "./globals.css";
import type { Metadata } from "next";
import { siteMetadata } from "../../config"

/**
 * Metadata for the entire application.
 * This metadata will be used across all pages of the application.
 * It defines default title behavior, descriptions, and Open Graph/Twitter card settings.
 */

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
  children: React.ReactNode;
}

/**
 * RootLayout - The root layout component for the entire application.
 * This layout is applied globally, wrapping all pages and preserving
 * metadata, layout structure, and styles.
 *
 * @param {RootLayoutProps} props - The component props
 * @param {React.ReactNode} props.children - The child components to render within the layout
 * @returns {JSX.Element} The root layout for the app
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

