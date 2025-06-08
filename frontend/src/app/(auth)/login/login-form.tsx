/**
 * @file app/login/login-form.tsx
 * @description Client-side login form component with OAuth and magic link support
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
import axios from "axios";

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
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers, isLoading, error: providersError } = useProviders();

  // Generate CSRF token
  const csrfToken = crypto.randomUUID();

  /**
   * Handle redirection to OAuth provider
   * @param url - The URL to redirect to
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
   * Handle magic link submission
   * @param e - The form event
   */
  const handleMagicLinkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/magic-link/login",
        { email },
        { headers: { "X-CSRF-Token": csrfToken } }
      );
      setSuccess(response.data.message);
      document.cookie = `csrf_token=${csrfToken}; path=/; max-age=900; samesite=lax`;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send magic link");
    }
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
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login with Email
        </Button>
      </form>

      {(error || providersError) && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || providersError}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
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
        Dont have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}