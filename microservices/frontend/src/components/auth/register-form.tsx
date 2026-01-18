'use client';

import axios from 'axios';
import { AlertCircle, Mail, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import OAuthButton from '@/components/auth/oauth-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProviders } from '@/hooks/use-provider';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { getUserMessage, logError } from '@/lib/error-handling';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  tier?: string;
  priceId?: string;
}

export function RegisterForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers, isLoading, error: providersError } = useProviders();

  // Generate CSRF token
  const csrfToken = crypto.randomUUID();

  useEffect(() => {
    const tier = searchParams.get('tier');
    const priceId = searchParams.get('price');

    if (tier || priceId) {
      setFormData((prev) => ({
        ...prev,
        tier: tier || undefined,
        priceId: priceId || undefined,
      }));
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('tier');
      newUrl.searchParams.delete('price');
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [searchParams]);

  /**
   * Handle redirection to OAuth provider
   * @param url - The URL to redirect to
   */
  const handleOAuthRedirect = (url: string) => {
    setIsRedirecting(true);
    if (url === 'https://localhost:3000/session') {
      // No redirect needed for local session
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
        'api/auth/magic-link/register',
        formData,
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      setSuccess(response.data.message);

      if (window.cookieStore) {
        await window.cookieStore.set({
          name: 'csrf_token',
          value: csrfToken,
          path: '/',
          sameSite: 'lax',
        });
      } else {
        // biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without Cookie Store API
        document.cookie = `csrf_token=${encodeURIComponent(csrfToken)}; path=/; max-age=900; samesite=lax; secure`;
      }
    } catch (error) {
      logError(error, {
        action: 'magic-link-register',
        email: formData.email,
        tier: formData.tier,
      });
      const errorMsg = getUserMessage(error);
      setError(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-b-2"
          style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Magic Link Form */}
      <form className="space-y-4" onSubmit={handleMagicLinkSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              First Name
            </Label>
            <div className="relative">
              <User
                className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <Input
                className="pl-10"
                id="firstName"
                name="firstName"
                onChange={handleInputChange}
                placeholder="Max"
                required
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
                value={formData.firstName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Last Name
            </Label>
            <div className="relative">
              <User
                className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <Input
                className="pl-10"
                id="lastName"
                name="lastName"
                onChange={handleInputChange}
                placeholder="Robinson"
                required
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                }}
                value={formData.lastName}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail
              className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            />
            <Input
              className="pl-10"
              id="email"
              name="email"
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
              type="email"
              value={formData.email}
            />
          </div>
        </div>
        {formData.tier && (
          <div className="space-y-2">
            <Label style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Selected Plan
            </Label>
            <Input
              className="pl-10"
              readOnly
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
              value={formData.tier}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            className="rounded"
            id="terms"
            required
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
            type="checkbox"
          />
          <label
            className="text-sm"
            htmlFor="terms"
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            I agree to the{' '}
            <Link
              className="hover:underline"
              href="/legal/terms"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              className="hover:underline"
              href="/legal/privacy"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        <Button
          className="w-full"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.primary,
            color: 'white',
          }}
          type="submit"
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
          <Sparkles
            className="h-4 w-4"
            style={{ color: BRAND_CONFIG.brand.colors.primary }}
          />
          <AlertTitle style={{ color: BRAND_CONFIG.brand.colors.primary }}>
            Success
          </AlertTitle>
          <AlertDescription
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span
            className="w-full border-t"
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
          />
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
            action="register"
            key={provider.name}
            onRedirect={handleOAuthRedirect}
            provider={provider.name}
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
              className="h-4 w-4 animate-spin rounded-full border-b-2"
              style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
            />
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Redirecting to authentication provider...
            </span>
          </div>
        </Alert>
      )}

      {/* Login Link */}
      <p
        className="text-center text-sm"
        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
      >
        Already have an account?{' '}
        <Link
          className="font-medium hover:underline"
          href="/login"
          style={{ color: BRAND_CONFIG.brand.colors.primary }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
