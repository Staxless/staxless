'use client';

import { AlertCircle, Loader2, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import OAuthButton from '@/components/auth/oauth-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProviders } from '@/hooks/use-provider';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { logError } from '@/lib/error-handling';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  tier?: string;
  priceId?: string;
}

export function RegisterForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { providers, isLoading: providersLoading, error: providersError } = useProviders();

  const isMagicLinkEnabled = providers.magicLink?.enabled ?? false;
  const hasOAuthProviders = providers.oauth && providers.oauth.length > 0;

  // Generate CSRF token
  const csrfToken = crypto.randomUUID();

  useEffect(() => {
    const tier = searchParams.get('tier');
    const priceId = searchParams.get('price');
    const error = searchParams.get('error');

    const newUrl = new URL(window.location.href);
    let needsCleanup = false;

    if (tier || priceId) {
      setFormData((prev) => ({
        ...prev,
        tier: tier || undefined,
        priceId: priceId || undefined,
      }));
      newUrl.searchParams.delete('tier');
      newUrl.searchParams.delete('price');
      needsCleanup = true;
    }

    if (error) {
      setUrlError(decodeURIComponent(error));
      newUrl.searchParams.delete('error');
      needsCleanup = true;
    }

    if (needsCleanup) {
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

    // Trim whitespace from inputs
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();

    // Name validation regex (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate first name
    if (!firstName || firstName.length < 2) {
      toast({
        title: 'Invalid name',
        description: 'First name must be at least 2 characters',
        variant: 'destructive',
      });
      return;
    }

    if (firstName.length > 50) {
      toast({
        title: 'Invalid name',
        description: 'First name must be less than 50 characters',
        variant: 'destructive',
      });
      return;
    }

    if (!nameRegex.test(firstName)) {
      toast({
        title: 'Invalid name',
        description: 'First name can only contain letters, spaces, hyphens, and apostrophes',
        variant: 'destructive',
      });
      return;
    }

    // Validate last name
    if (!lastName || lastName.length < 2) {
      toast({
        title: 'Invalid name',
        description: 'Last name must be at least 2 characters',
        variant: 'destructive',
      });
      return;
    }

    if (lastName.length > 50) {
      toast({
        title: 'Invalid name',
        description: 'Last name must be less than 50 characters',
        variant: 'destructive',
      });
      return;
    }

    if (!nameRegex.test(lastName)) {
      toast({
        title: 'Invalid name',
        description: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
        variant: 'destructive',
      });
      return;
    }

    // Validate email
    if (!email || !emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (email.length > 254) {
      toast({
        title: 'Invalid email',
        description: 'Email address is too long',
        variant: 'destructive',
      });
      return;
    }

    // Update form data with sanitized values
    const sanitizedData = {
      ...formData,
      firstName,
      lastName,
      email,
    };

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/magic-link/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(sanitizedData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected response format');
      }

      const data = await response.json();

      if (response.ok) {
        // Set CSRF token cookie
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

        // Redirect to success page
        router.push(`/magic-link-sent?email=${encodeURIComponent(formData.email)}`);
      } else {
        // API error
        toast({
          title: 'Error',
          description: data.error || 'Failed to send magic link',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      // Network error or parse error
      logError(error, {
        action: 'magic-link-register',
        email: formData.email,
        tier: formData.tier,
      });

      const errorMessage = error instanceof Error && error.message.includes('unexpected response format')
        ? 'The magic link service is currently unavailable. Please try again later.'
        : 'Unable to send magic link. Please check your connection.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (providersLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-b-2"
          style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
        />
      </div>
    );
  }

  // Show message if no auth methods are available
  if (!isMagicLinkEnabled && !hasOAuthProviders) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Authentication Methods Available</AlertTitle>
          <AlertDescription>
            Please contact support to enable authentication for your account.
          </AlertDescription>
        </Alert>
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

  return (
    <div className="space-y-6">
      {/* URL Error Alert (from OAuth redirects) */}
      {urlError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{urlError}</AlertDescription>
        </Alert>
      )}

      {/* Magic Link Form - Only show if enabled */}
      {isMagicLinkEnabled && (
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.primary,
              color: BRAND_CONFIG.brand.colors.background,
            }}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>
      )}

      {providersError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{providersError}</AlertDescription>
        </Alert>
      )}

      {/* Divider - Only show if both magic link and OAuth are available */}
      {isMagicLinkEnabled && hasOAuthProviders && (
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
      )}

      {/* OAuth Buttons - Only show if available */}
      {hasOAuthProviders && (
        <div className="space-y-3">
          {providers.oauth.map((provider) => (
            <OAuthButton
              action="register"
              key={provider.name}
              onRedirect={handleOAuthRedirect}
              provider={provider.name}
            />
          ))}
        </div>
      )}

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
