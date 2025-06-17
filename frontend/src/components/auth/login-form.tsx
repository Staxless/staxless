"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, Sparkles, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand-config";
import { useProviders } from "@/hooks/use-provider";
import axios from "axios";
import OAuthButton from "@/components/auth/oauth-button";

interface Provider {
  name: string;
}

export function LoginForm() {
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
  const handleOAuthRedirect = async (url: string) => {
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
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            Email Address
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.primary,
            color: "white",
          }}
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Send Magic Link</span>
          </div>
        </Button>
      </form>

      {(error || providersError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || providersError}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          className="border"
          style={{
            backgroundColor: `${BRAND_CONFIG.brand.colors.primary}10`,
            borderColor: BRAND_CONFIG.brand.colors.primary,
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: BRAND_CONFIG.brand.colors.primary }} />
          <AlertTitle style={{ color: BRAND_CONFIG.brand.colors.primary }}>Success</AlertTitle>
          <AlertDescription style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Separator style={{ backgroundColor: BRAND_CONFIG.brand.colors.border }} />

      <div className="space-y-3">
        <p className="text-center text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
          Or continue with
        </p>

        {providers?.map((provider) => (
          <OAuthButton
            key={provider.name}
            provider={provider.name}
            action="login"
            onRedirect={handleOAuthRedirect}
            // className="w-full border-2 hover:shadow-md transition-all duration-200"
            // style={{
            //   backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            //   borderColor: BRAND_CONFIG.brand.colors.border,
            //   color: BRAND_CONFIG.brand.colors.textPrimary,
            // }}
          />
        ))}
      </div>

      {isRedirecting && (
        <Alert
          className="border"
          style={{
            backgroundColor: `${BRAND_CONFIG.brand.colors.primary}10`,
            borderColor: BRAND_CONFIG.brand.colors.primary,
          }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="animate-spin rounded-full h-4 w-4 border-b-2"
              style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
            />
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Redirecting to authentication provider...
            </span>
          </div>
        </Alert>
      )}

      <p className="text-center text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
        {"Don't have an account? "}
        <Link
          href="/register"
          className="hover:underline font-medium"
          style={{ color: BRAND_CONFIG.brand.colors.primary }}
        >
          Create one here
        </Link>
      </p>
    </div>
  );
}