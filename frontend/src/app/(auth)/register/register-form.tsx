/**
 * @file app/register/register-form.tsx
 * @description Client-side registration form component with OAuth and magic link support
 */

"use client";

import { useState, FormEvent, useEffect } from "react";
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

/**
 * RegisterForm component
 * @returns {JSX.Element} The rendered registration form
 */
export default function RegisterForm() {
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
  const handleRedirect = async (url: string) => {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              name="firstName"
              placeholder="Max"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              name="lastName"
              placeholder="Robinson"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        {formData.tier && (
          <div className="space-y-2">
            <Label>Selected Plan</Label>
            <Input value={formData.tier} readOnly className="bg-gray-100" />
          </div>
        )}
        <Button type="submit" className="w-full">
          Register with Email
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
            action="register"
            onRedirect={handleRedirect}
            formData={formData}
          />
        ))}
      </div>

      {isRedirecting && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Redirecting to authentication provider...
        </p>
      )}

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </>
  );
}