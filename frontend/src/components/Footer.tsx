import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { useState, useEffect } from "react";
import BuildToScaleBadge from "./BuildToScaleBadge";

export default function Footer() {
  return (
    <footer className="bg-grey-200 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p>&copy; 2024 Acme Inc. All rights reserved.</p>
        <BuildToScaleBadge />
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
