"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/shared/user-menu"
import MobileMenu from "@/components/shared/mobile-menu"
import { useTheme } from "@/contexts/ThemeContext"
import StaxlessLogo from "@/components/shared/staxless-logo"
import { useEffect, useState } from "react"

interface NavItem {
  name: string
  href: string
}

interface User {
  name: string
  email: string
}

export interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const colors = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems: NavItem[] = [
    // Your navigation items here
  ]

  return (
    <header
      className={`py-6 px-4 sm:px-6 lg:px-8 fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
      style={{
        backgroundColor: isScrolled ? colors.background : `${colors.background}80`,
        backdropFilter: "blur(10px)",
        height: "var(--header-height)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <StaxlessLogo size={32} />
            <span className="text-xl font-bold" style={{ color: colors.primary }}>
              Staxless
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-bold transition-transform duration-200 ease-in-out transform hover:scale-110"
              style={{
                color: colors.text,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primary
                e.currentTarget.style.transform = "scale(1.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link href="/register" passHref>
              <Button
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  border: `2px solid ${colors.text}`,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
                className="px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background
                  e.currentTarget.style.color = colors.primary
                  e.currentTarget.style.transform = "translate(2px, 2px)"
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px rgba(0,0,0,1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary
                  e.currentTarget.style.color = colors.background
                  e.currentTarget.style.transform = "translate(0, 0)"
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
                }}
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
        <div className="md:hidden">
          <MobileMenu navItems={navItems} user={user} />
        </div>
      </div>
    </header>
  )
}

