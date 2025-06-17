import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BRAND_CONFIG } from "@/lib/brand-config"
import Link from "next/link"
import Logo from "@/components/shared/logo"

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Logo size="large" />
            <span className="text-2xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              {BRAND_CONFIG.company.name}
            </span>
          </Link>
          <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>Welcome back to your account</p>
        </div>

        <Card
          className="border shadow-lg"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            borderColor: BRAND_CONFIG.brand.colors.border,
          }}
        >
          <CardHeader className="text-center">
            <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Sign In</CardTitle>
            <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="text-sm hover:underline" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
