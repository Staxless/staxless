/**
 * @file Footer Component
 * @module Footer
 * @description A React component that renders the footer section of the website.
 */

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import StaxlessBadge from "./staxless-badge";
import { siteMetadata } from "../../../config";
/**
 * @function Footer
 * @description Renders the footer section with copyright information, a badge, and navigation links.
 * @returns {JSX.Element} The Footer component
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="bg-grey-200 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
      &copy; {new Date().getFullYear()} {siteMetadata.siteName}. All rights reserved.
        <StaxlessBadge />
        <nav className="flex items-center gap-4">
          <Link
            href="/legal/about"
            className="hover:underline"
            prefetch={false}
          >
            About
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="/legal/terms"
            className="hover:underline"
            prefetch={false}
          >
            Terms
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="/legal/privacy/"
            className="hover:underline"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
