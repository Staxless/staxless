"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand-config";
import { useProviders } from "@/hooks/use-provider";
import axios from "axios";
import OAuthButton from "@/components/auth/oauth-button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  tier?: string;
  priceId?: string;
}

interface Provider {
  name: string;
}

export function RegisterForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers, isLoading, error: providersError } = useProviders();

  // Generate CSRF token
  const csrfToken = crypto.randomUUID();

  useEffect(() => {
    const tier = searchParams.get("tier");
    const priceId = searchParams.get("price");

    if (tier || priceId) {
      setFormData((prev) => ({
        ...prev,
        tier: tier || undefined,
        priceId: priceId || undefined,
      }));
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("tier");
      newUrl.searchParams.delete("price");
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [searchParams]);

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
   * Handle input change
   * @param e - The input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        "http://localhost:3000/api/auth/magic-link/register",
        formData,
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
      {/* Magic Link Form */}
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              First Name
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <Input
                id="firstName"
                name="firstName"
                placeholder="Max"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="pl-10"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Last Name
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <Input
                id="lastName"
                name="lastName"
                placeholder="Robinson"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="pl-10"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
              />
            </div>
          </div>
        </div>
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
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
            />
          </div>
        </div>
        {formData.tier && (
          <div className="space-y-2">
            <Label style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>Selected Plan</Label>
            <Input
              value={formData.tier}
              readOnly
              className="pl-10"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            className="rounded"
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
            required
          />
          <label htmlFor="terms" className="text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
            I agree to the{" "}
            <Link href="/legal/terms" className="hover:underline" style={{ color: BRAND_CONFIG.brand.colors.primary }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="hover:underline"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        <Button
          type="submit"
          className="w-full"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.primary,
            color: "white",
          }}
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Create Account</span>
          </div>
        </Button>
      </form>

      {/* Error/Success Messages */}
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
          <AlertDescription style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>{success}</AlertDescription>
        </Alert>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" style={{ borderColor: BRAND_CONFIG.brand.colors.border }} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className="px-2"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              color: BRAND_CONFIG.brand.colors.textMuted,
            }}
          >
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        {providers?.map((provider) => (
          <OAuthButton
            key={provider.name}
            provider={provider.name}
            action="register"
            onRedirect={handleOAuthRedirect}
            formData={formData}
            className="w-full"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
              borderColor: BRAND_CONFIG.brand.colors.border,
              color: BRAND_CONFIG.brand.colors.textPrimary,
            }}
          />
        ))}
      </div>

      {/* Redirect Message */}
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

      {/* Login Link */}
      <p className="text-center text-sm" style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="hover:underline font-medium"
          style={{ color: BRAND_CONFIG.brand.colors.primary }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}