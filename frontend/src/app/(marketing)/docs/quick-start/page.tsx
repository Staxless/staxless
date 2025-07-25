'use client';

import { ArrowLeft, CheckCircle, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

const steps = [
  {
    title: 'Download & Install',
    description: 'Get the SaaS starter template and install dependencies',
    code: `git clone https://github.com/yoursaas/starter.git
cd starter
npm install`,
    time: '2 minutes',
  },
  {
    title: 'Environment Setup',
    description: 'Configure your environment variables',
    code: `cp .env.example .env.local
# Edit .env.local with your API keys`,
    time: '3 minutes',
  },
  {
    title: 'Database Setup',
    description: 'Initialize your database',
    code: `npm run db:migrate
npm run db:seed`,
    time: '1 minute',
  },
  {
    title: 'Start Development',
    description: 'Run the development server',
    code: 'npm run dev',
    time: '30 seconds',
  },
];

const features = [
  { id: 'auth', label: 'Authentication with OAuth' },
  { id: 'stripe', label: 'Stripe payment integration' },
  { id: 'dashboard', label: 'User dashboard' },
  { id: 'api', label: 'API endpoints' },
  { id: 'email', label: 'Email notifications' },
  { id: 'theme', label: 'Dark/light theme' },
];

export default function QuickStartPage() {
  const _copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header user={null} />

      <div className="pt-20">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center space-x-2">
            <Link
              className="flex items-center space-x-1 hover:underline"
              href="/docs"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Documentation</span>
            </Link>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              /
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              Quick Start
            </span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="mb-4 flex items-center space-x-3">
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <Zap
                  className="h-6 w-6"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
              <h1
                className="font-bold text-4xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Quick Start Guide
              </h1>
            </div>
            <p
              className="text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              Get your SaaS application up and running in under 10 minutes
            </p>
          </div>

          {/* What You'll Build */}
          <Card
            className="mb-12 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader>
              <CardTitle
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                What You'll Build
              </CardTitle>
              <CardDescription
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                A complete SaaS application with the following features:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {features.map((feature) => (
                  <div className="flex items-center space-x-2" key={feature.id}>
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: BRAND_CONFIG.brand.colors.success }}
                    />
                    <span
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <Card
                className="border"
                key={step.title}
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.primary,
                        }}
                      >
                        {/* Use step index visually only if needed, not as key */}
                        {/* If you want to show the step number, you can use steps.indexOf(step) + 1 */}
                      </div>
                      <div>
                        <CardTitle
                          style={{
                            color: BRAND_CONFIG.brand.colors.textPrimary,
                          }}
                        >
                          {step.title}
                        </CardTitle>
                        <CardDescription
                          style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                        >
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2 py-1 text-xs"
                      style={{
                        backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                        color: BRAND_CONFIG.brand.colors.primary,
                      }}
                    >
                      {step.time}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="rounded bg-muted p-4 text-xs">
                    <code>{step.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <Card
            className="mt-12 border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader>
              <CardTitle
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Next Steps
              </CardTitle>
              <CardDescription
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                Now that you have your SaaS running, here's what to do next:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link href="/docs/customization/branding">
                  <div
                    className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor:
                        BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3
                      className="mb-2 font-medium"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Customize Your Brand
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Learn how to white-label and customize the appearance
                    </p>
                  </div>
                </Link>
                <Link href="/docs/payments/stripe">
                  <div
                    className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor:
                        BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3
                      className="mb-2 font-medium"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Setup Payments
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Configure Stripe for subscription billing
                    </p>
                  </div>
                </Link>
                <Link href="/docs/auth/oauth">
                  <div
                    className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor:
                        BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3
                      className="mb-2 font-medium"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Configure OAuth
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Set up Google, GitHub, and other OAuth providers
                    </p>
                  </div>
                </Link>
                <Link href="/docs/api/overview">
                  <div
                    className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor:
                        BRAND_CONFIG.brand.colors.backgroundTertiary,
                      borderColor: BRAND_CONFIG.brand.colors.border,
                    }}
                  >
                    <h3
                      className="mb-2 font-medium"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Explore the API
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Learn about the REST API and integrations
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h2
              className="mb-4 font-bold text-2xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Need Help?
            </h2>
            <p
              className="mb-6"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              If you run into any issues, we're here to help
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: 'white',
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Discord Community
              </Button>
              <Button
                className="border"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
                variant="outline"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
