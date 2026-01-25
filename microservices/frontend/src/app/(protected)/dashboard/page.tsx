'use client';

import {
  Activity,
  BarChart3,
  Bell,
  DollarSign,
  FileText,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import DashboardWelcome from '@/components/dashboard/dashboard-welcome';
import ConfettiTrigger from '@/components/effects/confetti-trigger';
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

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: BRAND_CONFIG.brand.colors.primary,
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2%',
      icon: DollarSign,
      color: BRAND_CONFIG.brand.colors.success,
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+3.1%',
      icon: Activity,
      color: BRAND_CONFIG.brand.colors.warning,
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      change: '+2.4%',
      icon: TrendingUp,
      color: BRAND_CONFIG.brand.colors.primary,
    },
  ];

  const recentActivity = [
    { action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { action: 'Payment received', time: '5 minutes ago', type: 'payment' },
    { action: 'System backup completed', time: '1 hour ago', type: 'system' },
    { action: 'New feature deployed', time: '3 hours ago', type: 'deployment' },
  ];

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      {/* Confetti Trigger - only shows once after successful checkout */}
      <ConfettiTrigger />
      <Header />
      <div className="pt-20">
        <div className="container mx-auto p-6">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h1
                className="mb-2 font-bold text-3xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Dashboard
              </h1>
              <DashboardWelcome />
            </div>

            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <div className="relative">
                <Search
                  className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  className="w-64 border pl-10"
                  placeholder="Search..."
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                />
              </div>
              <Button
                className="transition-colors"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: BRAND_CONFIG.brand.colors.background,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    BRAND_CONFIG.brand.colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    BRAND_CONFIG.brand.colors.primary;
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card
                className="border shadow-sm"
                key={stat.title}
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                    className="font-medium text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    {stat.title}
                  </CardTitle>
                  <stat.icon
                    className="h-4 w-4"
                    style={{ color: stat.color }}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className="font-bold text-2xl"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-xs" style={{ color: stat.color }}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart Card */}
            <Card
              className="border lg:col-span-2"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Revenue Overview
                </CardTitle>
                <CardDescription
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  Monthly revenue for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed"
                  style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
                >
                  <div className="text-center">
                    <BarChart3
                      className="mx-auto mb-4 h-12 w-12"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    />
                    <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                      Chart component would go here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card
              className="border"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Recent Activity
                </CardTitle>
                <CardDescription
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                >
                  Latest updates from your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      className="flex items-start space-x-3"
                      key={activity.action + activity.time}
                    >
                      <div
                        className="mt-2 h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.primary,
                        }}
                      />
                      <div className="flex-1">
                        <p
                          className="font-medium text-sm"
                          style={{
                            color: BRAND_CONFIG.brand.colors.textPrimary,
                          }}
                        >
                          {activity.action}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2
              className="mb-4 font-semibold text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card
                className="cursor-pointer border transition-shadow hover:shadow-md"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <Settings
                    className="mx-auto mb-3 h-8 w-8"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                  <h3
                    className="mb-2 font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Account Settings
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    Manage your account preferences
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer border transition-shadow hover:shadow-md"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <FileText
                    className="mx-auto mb-3 h-8 w-8"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                  <h3
                    className="mb-2 font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Documentation
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    View API docs and guides
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer border transition-shadow hover:shadow-md"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <Bell
                    className="mx-auto mb-3 h-8 w-8"
                    style={{ color: BRAND_CONFIG.brand.colors.primary }}
                  />
                  <h3
                    className="mb-2 font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Notifications
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    Configure alert preferences
                  </p>
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
