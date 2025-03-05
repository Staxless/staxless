"use client"
import type { ReactNode } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthLayoutProps {
  children: ReactNode
  params: {
    slug: string
  }
}

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  const { slug } = params
  const colors = useTheme()

  const titles = {
    login: {
      title: "Welcome back",
      description: "Login to your account",
    },
    register: {
      title: "Create an account",
      description: "Sign up for a new account",
    },
  }

  const { title, description } = titles[slug as keyof typeof titles] || titles.login

  return (
    <main
      style={{ backgroundColor: colors.background, color: colors.text }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <Card style={{ backgroundColor: colors.background, color: colors.text }}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  )
}

