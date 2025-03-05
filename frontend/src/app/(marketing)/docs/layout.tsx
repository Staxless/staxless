"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DocSidebar } from "@/components/doc-sidebar"
import { ThemeProvider } from "@/contexts/ThemeContext"
import StaxlessBadge from "@/components/shared/staxless-badge"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock user for demonstration - replace with your auth logic
  const user = null

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen [--header-height:5rem] [--footer-height:4rem]">
        <SidebarProvider>
          <div className="flex flex-1 pt-[--header-height]">
            <DocSidebar />
            <SidebarInset className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
              <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>

        {/* Fixed position badge in the bottom right corner */}
        <div className="fixed bottom-4 right-4 z-50">
          <StaxlessBadge />
        </div>
      </div>
    </ThemeProvider>
  )
}

