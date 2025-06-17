"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/shared/user-menu"
import MobileMenu from "@/components/shared/mobile-menu"
import Logo from "@/components/shared/logo"
import { useEffect, useState } from "react"
import { BRAND_CONFIG } from "@/lib/brand-config"
import StaxlessLogo from "./staxless-logo"

interface User {
  name: string
  email: string
}

export interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = BRAND_CONFIG.navigation.main

  return (
    <header
      className={`py-4 px-4 sm:px-6 lg:px-8 fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Logo size="medium" />
          <span className="text-xl font-medium text-gray-900">{BRAND_CONFIG.company.name}</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-black font-medium text-gray-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium text-gray-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium rounded-lg px-6 bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <MobileMenu navItems={navItems} user={user} />
        </div>
      </div>
    </header>
  )
}
