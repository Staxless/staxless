/**
 * @file OAuthButton.tsx
 * @description Provides a reusable OAuth button component for various providers
 * @module components/OAuthButton
 */

'use client';

import { Apple, Facebook, Github, Gitlab, Twitch, Twitter } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { FaBitbucket, FaDiscord, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiAuth0, SiOkta } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@config/brand-config';

/**
 * @description Types of OAuth providers supported by the component
 */
type ConfiguredProvider =
  | 'google'
  | 'github'
  | 'facebook'
  | 'twitter'
  | 'microsoft'
  | 'auth0'
  | 'okta'
  | 'apple'
  | 'discord'
  | 'gitlab'
  | 'bitbucket'
  | 'twitch';

/**
 * @description Props for the OAuthButton component
 */
interface OAuthButtonProps {
  provider: string;
  action: 'login' | 'register';
  onRedirect: (url: string) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * @description Configuration for each OAuth provider
 */
const providerConfig = {
  google: { icon: FaGoogle, color: '#4285f4' },
  github: { icon: Github, color: '#24292e' },
  facebook: { icon: Facebook, color: '#1877f2' },
  twitter: { icon: Twitter, color: '#1da1f2' },
  microsoft: { icon: FaMicrosoft, color: '#2f2f2f' },
  auth0: { icon: SiAuth0, color: '#eb5424' },
  okta: { icon: SiOkta, color: '#007dc1' },
  apple: { icon: Apple, color: '#000000' },
  discord: { icon: FaDiscord, color: '#7289da' },
  gitlab: { icon: Gitlab, color: '#fc6d26' },
  bitbucket: { icon: FaBitbucket, color: '#0052cc' },
  twitch: { icon: Twitch, color: '#9146ff' },
} as const;

/**
 * @description OAuth button component for various providers
 * @param {OAuthButtonProps} props - The component props
 * @returns {JSX.Element} The rendered OAuth button
 */
export default function OAuthButton({
  provider,
  action,
  onRedirect,
  className,
  style,
}: OAuthButtonProps): React.ReactElement {
  // @ts-check-ignore
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConfigured = provider in providerConfig;
  const { icon: Icon } = isConfigured
    ? providerConfig[provider as ConfiguredProvider]
    : { icon: () => null };

  const buttonText = `${action === 'login' ? 'Login' : 'Register'} with ${
    provider.charAt(0).toUpperCase() + provider.slice(1)
  }`;

  /**
   * @description Handles the button click event
   */
  const handleClick = () => {
    if (!isConfigured) {
      setError(`Provider ${provider} is not configured`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `/api/oauth/${action}/${provider}`;
      onRedirect(endpoint);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setIsLoading(false);
    }
  };

  // Determine if the background color is dark to adjust text/icon color
  const isDarkBg = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const colors = BRAND_CONFIG.brand.colors;
  const textColor = isDarkBg(colors.backgroundSecondary)
    ? colors.textPrimary
    : colors.background;

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm" role="alert" style={{ color: colors.error }}>
          {error}
        </p>
      )}
      <Button
        aria-busy={isLoading}
        aria-disabled={!isConfigured || isLoading}
        aria-label={buttonText}
        className={`w-full border-2 transition-all duration-200 hover:shadow-md ${className}`}
        disabled={!isConfigured || isLoading}
        onClick={handleClick}
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
          color: textColor,
          ...style,
        }}
        variant="outline"
      >
        {Icon && (
          <Icon
            aria-hidden="true"
            className="mr-3 h-5 w-5"
            style={{ color: textColor }}
          />
        )}
        <span className="truncate">
          {isLoading
            ? 'Loading...'
            : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
        </span>
      </Button>
    </div>
  );
}
