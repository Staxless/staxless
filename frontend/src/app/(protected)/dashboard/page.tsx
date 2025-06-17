// "use client"
import { headers } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BRAND_CONFIG } from "@/lib/brand-config"
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Plus,
  BarChart3,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Header from "@/components/shared/header"
import ConfettiTrigger from "@/components/effects/confetti-trigger"
import Footer from "@/components/shared/footer"



export default async function DashboardPage() {
  


  const headersList = await headers()
    const userInfoString = headersList.get("x-user-info")
    const user = userInfoString ? JSON.parse(userInfoString) : null
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: BRAND_CONFIG.brand.colors.primary,
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+8.2%",
      icon: DollarSign,
      color: BRAND_CONFIG.brand.colors.success,
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+3.1%",
      icon: Activity,
      color: BRAND_CONFIG.brand.colors.warning,
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+2.4%",
      icon: TrendingUp,
      color: BRAND_CONFIG.brand.colors.primary,
    },
  ]

  const recentActivity = [
    { action: "New user registered", time: "2 minutes ago", type: "user" },
    { action: "Payment received", time: "5 minutes ago", type: "payment" },
    { action: "System backup completed", time: "1 hour ago", type: "system" },
    { action: "New feature deployed", time: "3 hours ago", type: "deployment" },
  ]

  return (
    <div style={{ backgroundColor: BRAND_CONFIG.brand.colors.background, minHeight: "100vh" }}>
      {/* Confetti Trigger - only shows once after successful checkout */}
      <ConfettiTrigger />
      <Header user={user} />
      <div className="pt-20">
        <div className="container mx-auto p-6">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                Dashboard
              </h1>
              <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                Welcome back, {user.name}! Here's what's happening with your SaaS.
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 border"
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                    color: BRAND_CONFIG.brand.colors.textPrimary,
                  }}
                />
              </div>
              <Button
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: "white",
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border shadow-sm"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    {stat.value}
                  </div>
                  <p className="text-xs" style={{ color: BRAND_CONFIG.brand.colors.success }}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Card */}
            <Card
              className="lg:col-span-2 border"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader>
                <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Revenue Overview</CardTitle>
                <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                  Monthly revenue for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg"
                  style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
                >
                  <div className="text-center">
                    <BarChart3
                      className="h-12 w-12 mx-auto mb-4"
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    />
                    <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>Chart component would go here</p>
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
                <CardTitle style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Recent Activity</CardTitle>
                <CardDescription style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                  Latest updates from your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: BRAND_CONFIG.brand.colors.primary }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                          {activity.action}
                        </p>
                        <p className="text-xs" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
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
            <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-3" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                  <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    Account Settings
                  </h3>
                  <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    Manage your account preferences
                  </p>
                </CardContent>
              </Card>

              <Card
                className="border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                  <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    Documentation
                  </h3>
                  <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                    View API docs and guides
                  </p>
                </CardContent>
              </Card>

              <Card
                className="border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                }}
              >
                <CardContent className="p-6 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-3" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
                  <h3 className="font-medium mb-2" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
                    Notifications
                  </h3>
                  <p className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
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
  )
}
