'use client';

import { AlertCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import OAuthButton from '@/components/auth/oauth-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProviders } from '@/hooks/use-provider';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { logError } from '@/lib/error-handling';

export function LoginForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();
  const { providers, isLoading: providersLoading, error: providersError } = useProviders();

  // Generate CSRF token
  const csrfToken = crypto.randomUUID();

  /**
   * Handle redirection to OAuth provider
   * @param url - The URL to redirect to
   */
  const handleOAuthRedirect = (url: string) => {
    setIsRedirecting(true);
    if (url === 'https://localhost:3000/session') {
      // No redirect needed for local session
    } else {
      window.location.href = url;
      // router.push(url);
    }
  };

  /**
   * Handle magic link submission
   * @param e - The form event
   */
  async function handleMagicLinkSubmit(e: FormEvent) {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/magic-link/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email }),
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
        router.push(`/magic-link-sent?email=${encodeURIComponent(email)}`);
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
      logError(error, { action: 'magic-link-login', email });

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
  }

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

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleMagicLinkSubmit}>
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
              className="border pl-10"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                borderColor: BRAND_CONFIG.brand.colors.border,
                color: BRAND_CONFIG.brand.colors.textPrimary,
              }}
              type="email"
              value={email}
            />
          </div>
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
              Sending magic link...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send magic link
            </>
          )}
        </Button>
      </form>

      {providersError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{providersError}</AlertDescription>
        </Alert>
      )}

      <Separator
        style={{ backgroundColor: BRAND_CONFIG.brand.colors.border }}
      />

      <div className="space-y-3">
        <p
          className="text-center text-sm"
          style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
        >
          Or continue with
        </p>

        {providers?.map((provider) => (
          <OAuthButton
            action="login"
            key={provider.name}
            onRedirect={handleOAuthRedirect}
            provider={provider.name}
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
              className="h-4 w-4 animate-spin rounded-full border-b-2"
              style={{ borderColor: BRAND_CONFIG.brand.colors.primary }}
            />
            <span style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}>
              Redirecting to authentication provider...
            </span>
          </div>
        </Alert>
      )}

      <p
        className="text-center text-sm"
        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
      >
        {"Don't have an account? "}
        <Link
          className="font-medium hover:underline"
          href="/register"
          style={{ color: BRAND_CONFIG.brand.colors.primary }}
        >
          Create one here
        </Link>
      </p>
    </div>
  );
}
