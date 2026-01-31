import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react'; // Add Suspense import
import { RegisterForm } from '@/components/auth/register-form';
import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@config/brand-config';

// Force the page to be dynamic to avoid prerendering issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
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
            <Suspense fallback={<div>Loading registration form...</div>}>
              <RegisterForm />
            </Suspense>
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
