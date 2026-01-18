'use client';

import {
  ArrowRight,
  Book,
  ChevronRight,
  Code,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Search,
  Settings,
  Star,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { BRAND_CONFIG } from '@/lib/brand-config';

// For quickStartSteps, featuredGuides, and apiEndpoints, add a unique id to each item for use as React key.
const quickStartSteps = [
  {
    id: 'install',
    step: '01',
    title: 'Installation',
    description: 'Get started with our CLI tool or download the template',
    time: '2 min',
  },
  {
    id: 'config',
    step: '02',
    title: 'Configuration',
    description: 'Set up your environment variables and database',
    time: '5 min',
  },
  {
    id: 'custom',
    step: '03',
    title: 'Customization',
    description: 'Brand your application and configure features',
    time: '10 min',
  },
  {
    id: 'deploy',
    step: '04',
    title: 'Deploy',
    description: 'Launch your SaaS application to production',
    time: '3 min',
  },
];

const featuredGuides = [
  {
    id: 'auth-setup',
    title: 'Authentication Setup',
    description: 'Complete guide to setting up OAuth and magic links',
    category: 'Security',
    readTime: '15 min',
    difficulty: 'Intermediate',
    href: '/docs/auth/setup',
  },
  {
    id: 'payments',
    title: 'Payment Integration',
    description: 'Integrate Stripe payments and subscription billing',
    category: 'Payments',
    readTime: '20 min',
    difficulty: 'Advanced',
    href: '/docs/payments/stripe',
  },
  {
    id: 'branding',
    title: 'Custom Branding',
    description: 'White-label your application with custom themes',
    category: 'Design',
    readTime: '12 min',
    difficulty: 'Beginner',
    href: '/docs/customization/branding',
  },
];

const apiEndpoints = [
  {
    id: 'users',
    method: 'GET',
    endpoint: '/api/users',
    description: 'Fetch user data',
  },
  {
    id: 'login',
    method: 'POST',
    endpoint: '/api/auth/login',
    description: 'User authentication',
  },
  {
    id: 'checkout',
    method: 'POST',
    endpoint: '/api/payments/checkout',
    description: 'Create checkout session',
  },
  {
    method: 'GET',
    endpoint: '/api/subscriptions',
    description: 'Manage subscriptions',
  },
];

// Replace nested ternary with a function for clarity
function getDifficultyValue(difficulty: string) {
  if (difficulty === 'Beginner') {
    return 1;
  }
  if (difficulty === 'Intermediate') {
    return 2;
  }
  return 3;
}

export default function DocsPage() {
  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header user={null} />

      <div className="pt-20">
        {/* Hero Section */}
        <section
          className="border-b px-4 py-16"
          style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <div
                  className="rounded-full p-4"
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                  }}
                >
                  <Book
                    className="h-12 w-12"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                </div>
              </div>
              <h1
                className="mb-6 font-bold text-4xl md:text-6xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Documentation
              </h1>
              <p
                className="mx-auto mb-8 max-w-2xl text-xl"
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                Everything you need to build, customize, and scale your SaaS
                application
              </p>

              {/* Search Bar */}
              <div className="relative mx-auto max-w-lg">
                <Search
                  className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 transform"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  className="rounded-xl border-2 py-4 pl-12 text-lg"
                  placeholder="Search documentation..."
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {quickStartSteps.map((step) => (
                <Card
                  className="cursor-pointer border-2 transition-all duration-200 hover:shadow-lg"
                  key={step.id}
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className="font-bold text-3xl opacity-30"
                        style={{ color: BRAND_CONFIG.brand.colors.primary }}
                      >
                        {step.step}
                      </span>
                      <span
                        className="rounded-full px-2 py-1 text-sm"
                        style={{
                          backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                          color: BRAND_CONFIG.brand.colors.primary,
                        }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <h3
                      className="mb-2 font-semibold"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              {/* Featured Guides */}
              <section>
                <div className="mb-8 flex items-center justify-between">
                  <h2
                    className="font-bold text-3xl"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Featured Guides
                  </h2>
                  <Link href="/docs/guides">
                    <Button
                      className="border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                      variant="outline"
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-6">
                  {featuredGuides.map((guide) => (
                    <Link href={guide.href} key={guide.id}>
                      <Card className="group flex flex-col justify-between border-2 transition-all duration-200 hover:shadow-lg">
                        <CardContent className="flex flex-col gap-4 p-6">
                          <div className="mb-3 flex items-center space-x-3">
                            <span
                              className="rounded-full px-3 py-1 font-medium text-sm"
                              style={{
                                backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                                color: BRAND_CONFIG.brand.colors.primary,
                              }}
                            >
                              {guide.category}
                            </span>
                            <span
                              className="text-sm"
                              style={{
                                color: BRAND_CONFIG.brand.colors.textMuted,
                              }}
                            >
                              {guide.readTime}
                            </span>
                            <div className="flex items-center">
                              {/* Use a unique string key for stars by combining guide.id and starIdx */}
                              {[
                                ...new Array(
                                  getDifficultyValue(guide.difficulty)
                                ),
                              ].map((_, starIdx) => (
                                <Star
                                  className="h-3 w-3 fill-current"
                                  key={`star-${guide.id}-${starIdx}`}
                                  style={{
                                    color: BRAND_CONFIG.brand.colors.primary,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <h3
                            className="mb-2 font-semibold text-xl"
                            style={{
                              color: BRAND_CONFIG.brand.colors.textPrimary,
                            }}
                          >
                            {guide.title}
                          </h3>
                          <p
                            style={{
                              color: BRAND_CONFIG.brand.colors.textMuted,
                            }}
                          >
                            {guide.description}
                          </p>
                        </CardContent>
                        <ChevronRight
                          className="h-5 w-5 transition-transform group-hover:translate-x-1"
                          style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                        />
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              {/* API Reference */}
              <section>
                <h2
                  className="mb-8 font-bold text-3xl"
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  API Reference
                </h2>
                <Card
                  className="border-2"
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardHeader>
                    <CardTitle
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Popular Endpoints
                    </CardTitle>
                    <CardDescription
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Most commonly used API endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiEndpoints.map((endpoint) => (
                        <div
                          className="flex items-center justify-between rounded-lg border p-4"
                          key={endpoint.id}
                          style={{
                            backgroundColor:
                              BRAND_CONFIG.brand.colors.backgroundTertiary,
                            borderColor: BRAND_CONFIG.brand.colors.border,
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <span
                              className="rounded px-2 py-1 font-mono text-xs"
                              style={{
                                backgroundColor:
                                  endpoint.method === 'GET'
                                    ? '#10b98120'
                                    : '#f59e0b20',
                                color:
                                  endpoint.method === 'GET'
                                    ? '#10b981'
                                    : '#f59e0b',
                              }}
                            >
                              {endpoint.method}
                            </span>
                            <code
                              className="font-mono text-sm"
                              style={{
                                color: BRAND_CONFIG.brand.colors.textPrimary,
                              }}
                            >
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <span
                            className="text-sm"
                            style={{
                              color: BRAND_CONFIG.brand.colors.textMuted,
                            }}
                          >
                            {endpoint.description}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/docs/api">
                        <Button
                          className="w-full"
                          style={{
                            backgroundColor: BRAND_CONFIG.brand.colors.primary,
                            color: 'white',
                          }}
                        >
                          View Full API Documentation
                          <Code className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card
                className="border-2"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <CardTitle
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/api-keys">
                    <Button
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                      variant="outline"
                    >
                      <Code className="mr-2 h-4 w-4" />
                      API Keys
                    </Button>
                  </Link>
                  <Link href="/dashboard/billing">
                    <Button
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                      variant="outline"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button
                      className="w-full justify-start border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        color: BRAND_CONFIG.brand.colors.textPrimary,
                      }}
                      variant="outline"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card
                className="border-2"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6">
                  <div className="space-y-4 text-center">
                    <HelpCircle
                      className="mx-auto h-12 w-12"
                      style={{ color: BRAND_CONFIG.brand.colors.primary }}
                    />
                    <h3
                      className="font-semibold"
                      style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                    >
                      Need Help?
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      Our support team is here to help you get the most out of
                      your SaaS application.
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.primary,
                          color: 'white',
                        }}
                      >
                        Contact Support
                      </Button>
                      <Button
                        className="w-full border"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: BRAND_CONFIG.brand.colors.border,
                          color: BRAND_CONFIG.brand.colors.textPrimary,
                        }}
                        variant="outline"
                      >
                        Join Community
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card
                className="border-2"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader>
                  <CardTitle
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link
                      className="flex items-center justify-between rounded p-2 transition-colors hover:bg-opacity-50"
                      href="/changelog"
                      style={{
                        backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30`,
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        Changelog
                      </span>
                      <ExternalLink
                        className="h-4 w-4"
                        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                      />
                    </Link>
                    <Link
                      className="flex items-center justify-between rounded p-2 transition-colors hover:bg-opacity-50"
                      href="/status"
                      style={{
                        backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30`,
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        System Status
                      </span>
                      <ExternalLink
                        className="h-4 w-4"
                        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                      />
                    </Link>
                    <Link
                      className="flex items-center justify-between rounded p-2 transition-colors hover:bg-opacity-50"
                      href="/roadmap"
                      style={{
                        backgroundColor: `${BRAND_CONFIG.brand.colors.backgroundTertiary}30`,
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        Roadmap
                      </span>
                      <ExternalLink
                        className="h-4 w-4"
                        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                      />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
