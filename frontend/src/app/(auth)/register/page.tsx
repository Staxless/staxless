import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

export const metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="mb-8 text-center">
          <Link
            className="mb-4 flex items-center justify-center space-x-2"
            href="/"
          >
            <Logo size="large" />
            <span
              className="font-bold text-2xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              {BRAND_CONFIG.company.name}
            </span>
          </Link>
          <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }} />
        </div>

        <Card
          className="border shadow-lg"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            borderColor: BRAND_CONFIG.brand.colors.border,
          }}
        >
          <CardHeader className="text-center">
            <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Create Account
            </CardTitle>
            <CardDescription
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              Get started with your free account today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 space-y-2 text-center">
          <Link
            className="text-sm hover:underline"
            href="/"
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
