"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OAuthButton from "@/components/auth/OAuthButton";

type TabType = "register" | "login";

/**
 * AuthPage component handles user authentication with tabs for login and registration.
 *
 * @component
 * @example
 * return (
 *   <AuthPage />
 * )
 */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("register");

  /**
   * Handles the change of tabs between registration and login.
   *
   * @param value - The value of the selected tab.
   */
  const handleTabChange = (value: string) => {
    if (value === "register" || value === "login") {
      setActiveTab(value);
    }
  };

  // Array of available OAuth providers.
  const providers = ["github", "gitlab", "bitbucket"];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                {activeTab === "register"
                  ? "Create an account"
                  : "Welcome back"}
              </CardTitle>
              <CardDescription>
                {activeTab === "register"
                  ? "Enter your information to register"
                  : "Login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px]">
                {activeTab === "register" && (
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" placeholder="Max" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" placeholder="Robinson" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                  </form>
                )}
                {activeTab === "login" && (
                  <p className="text-center text-sm text-gray-500 mb-4">
                    Choose a method to log in
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <div className="grid gap-2 grid-cols-1">
                {providers.map((provider) => (
                  <OAuthButton
                    key={provider}
                    provider={provider}
                    action={activeTab}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
