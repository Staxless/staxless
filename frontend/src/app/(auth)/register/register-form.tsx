/**
 * @file app/register/register-form.tsx
 * @description Client-side registration form component with OAuth provider support and plan selection
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
import { storePlanSelection } from "@/app/server-actions/store-plan-selection";
import { useProviders } from "@/app/hooks/use-provider";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  tier?: string;
  priceId?: string;
}

/**
 * RegisterForm component
 * @returns {JSX.Element} The rendered registration form
 */
export default function RegisterForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers, isLoading, error: providersError } = useProviders();

  useEffect(() => {
    const tier = searchParams.get("tier");
    const priceId = searchParams.get("price");

    if (tier || priceId) {
      setFormData((prev) => ({
        ...prev,
        tier: tier || undefined,
        priceId: priceId || undefined,
      }));
    }
  }, [searchParams]);

  /**
   * Handle redirection to OAuth provider
   * @param {string} url - The URL to redirect to
   */
  const handleRedirect = async (url: string) => {
    setIsRedirecting(true);
    if (url === "https://localhost:3000/session") {
      console.warn(url);
    } else {
      if (formData.tier && formData.priceId) {
        await storePlanSelection(formData.tier, formData.priceId);
      }
      router.push(url);
    }
  };

  /**
   * Handle input change
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * @param {FormEvent} e - The form event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (formData.tier && formData.priceId) {
        await storePlanSelection(formData.tier, formData.priceId);
      }
      router.push("/checkout");
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again.");
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          Register
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
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </>
  );
}
