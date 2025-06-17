"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Logo from "./logo"
import { BRAND_CONFIG } from "@/lib/brand-config"
import { SignOutButton } from "../auth/sign-out-button"

interface NavItem {
  name: string
  href: string
}

interface User {
  name: string
  email: string
}

interface MobileMenuProps {
  navItems: NavItem[]
  user: User | null
}

export default function MobileMenu({ navItems, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <Logo size="medium" />
            <span className="text-xl font-semibold">{BRAND_CONFIG.company.name}</span>
          </Link>
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block text-lg text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Settings
                  </Button>
                </Link>
                {/* <Button variant="ghost" className="w-full justify-start text-red-600">
                  Sign out
                </Button> */}
                <SignOutButton />
              </div>
            </div>
          ) : (
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
