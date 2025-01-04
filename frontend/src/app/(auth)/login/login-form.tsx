/**
 * @file app/login/login-form.tsx
 * @description Client-side login form component with OAuth provider support
 */

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import OAuthButton from "@/components/auth/oauth-button";
import { useProviders } from "@/app/hooks/use-provider";

interface Provider {
  name: string;
}

/**
 * LoginForm component
 * @returns {JSX.Element} The rendered login form
 */
export default function LoginForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers, isLoading, error: providersError } = useProviders();

  /**
   * Handle redirection to OAuth provider
   * @param {string} url - The URL to redirect to
   */
  const handleRedirect = async (url: string) => {
    setIsRedirecting(true);
    if (url === "https://localhost:3000/session") {
      console.warn(url);
    } else {
      router.push(url);
    }
  };

  /**
   * Handle form submission
   * @param {FormEvent} e - The form event
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      {(error || providersError) && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || providersError}</AlertDescription>
        </Alert>
      )}

      <Separator className="my-4" />

      <div className="grid gap-2 grid-cols-1">
        {providers?.map((provider) => (
          <OAuthButton
            key={provider.name}
            provider={provider.name}
            action="login"
            onRedirect={handleRedirect}
          />
        ))}
      </div>

      {isRedirecting && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Redirecting to authentication provider...
        </p>
      )}

      <p className="text-center text-sm text-gray-500 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}
