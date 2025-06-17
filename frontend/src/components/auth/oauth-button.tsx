/**
 * @file OAuthButton.tsx
 * @description Provides a reusable OAuth button component for various providers
 * @module components/OAuthButton
 */

"use client"

// External imports
import { useState } from "react";
import { Github, Facebook, Twitter, Twitch, Apple, Gitlab } from "lucide-react";
import { FaGoogle, FaMicrosoft, FaDiscord, FaBitbucket } from "react-icons/fa";
import { SiAuth0, SiOkta } from "react-icons/si";

// Internal imports
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand-config";

/**
 * @description Types of OAuth providers supported by the component
 */
type ConfiguredProvider =
  | "google"
  | "github"
  | "facebook"
  | "twitter"
  | "microsoft"
  | "auth0"
  | "okta"
  | "apple"
  | "discord"
  | "gitlab"
  | "bitbucket"
  | "twitch";

/**
 * @description Form data structure for registration
 */
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * @description Props for the OAuthButton component
 */
interface OAuthButtonProps {
  provider: string;
  action: "login" | "register";
  onRedirect: (url: string) => void;
  formData?: FormData;
}

/**
 * @description Configuration for each OAuth provider
 */
const providerConfig = {
  google: { icon: FaGoogle, color: "#4285f4" },
  github: { icon: Github, color: "#24292e" },
  facebook: { icon: Facebook, color: "#1877f2" },
  twitter: { icon: Twitter, color: "#1da1f2" },
  microsoft: { icon: FaMicrosoft, color: "#2f2f2f" },
  auth0: { icon: SiAuth0, color: "#eb5424" },
  okta: { icon: SiOkta, color: "#007dc1" },
  apple: { icon: Apple, color: "#000000" },
  discord: { icon: FaDiscord, color: "#7289da" },
  gitlab: { icon: Gitlab, color: "#fc6d26" },
  bitbucket: { icon: FaBitbucket, color: "#0052cc" },
  twitch: { icon: Twitch, color: "#9146ff" },
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
}: OAuthButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = provider in providerConfig;
  const { icon: Icon, color } = isConfigured
    ? providerConfig[provider as ConfiguredProvider]
    : { icon: () => null, color: "#6b7280" }; // Fallback color (gray-500)

  const buttonText = `${action === "login" ? "Login" : "Register"} with ${
    provider.charAt(0).toUpperCase() + provider.slice(1)
  }`;

  /**
   * @description Handles the button click event
   */
  const handleClick = async () => {
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
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setIsLoading(false);
    }
  };

  // Determine if the background color is dark to adjust text/icon color
  const isDarkBg = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const textColor = isDarkBg(BRAND_CONFIG.brand.colors.backgroundSecondary)
    ? "#ffffff"
    : "#000000";

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="outline"
        className="w-full border-2 hover:shadow-md transition-all duration-200"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
          color: textColor,
        }}
        disabled={!isConfigured || isLoading}
        aria-label={buttonText}
        aria-busy={isLoading}
        aria-disabled={!isConfigured || isLoading}
      >
        {Icon && <Icon className="h-5 w-5 mr-3" style={{ color: textColor }} aria-hidden="true" />}
        <span className="truncate">
          {isLoading ? "Loading..." : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
        </span>
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}