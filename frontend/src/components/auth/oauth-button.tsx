/**
 * @file OAuthButton.tsx
 * @description Provides a reusable OAuth button component for various providers
 * @module components/OAuthButton
 */

// External imports
import { useState } from "react";
import { Github, Facebook, Twitter, Twitch, Apple, Gitlab } from "lucide-react";
import { FaGoogle, FaMicrosoft, FaDiscord, FaBitbucket } from "react-icons/fa";
import { SiAuth0, SiOkta } from "react-icons/si";

// Internal imports
import { Button } from "@/components/ui/button";

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
  google: { icon: FaGoogle, color: "bg-[#4285F4] hover:bg-[#357AE8]" },
  github: { icon: Github, color: "bg-[#24292e] hover:bg-[#1c2126]" },
  facebook: { icon: Facebook, color: "bg-[#1877F2] hover:bg-[#166FE5]" },
  twitter: { icon: Twitter, color: "bg-[#1DA1F2] hover:bg-[#0C8AE0]" },
  microsoft: { icon: FaMicrosoft, color: "bg-[#2F2F2F] hover:bg-[#1E1E1E]" },
  auth0: { icon: SiAuth0, color: "bg-[#EB5424] hover:bg-[#D94514]" },
  okta: { icon: SiOkta, color: "bg-[#007DC1] hover:bg-[#006DAE]" },
  apple: { icon: Apple, color: "bg-[#000000] hover:bg-[#1A1A1A]" },
  discord: { icon: FaDiscord, color: "bg-[#7289DA] hover:bg-[#5E78D5]" },
  gitlab: { icon: Gitlab, color: "bg-[#FC6D26] hover:bg-[#E24329]" },
  bitbucket: { icon: FaBitbucket, color: "bg-[#0052CC] hover:bg-[#0047B3]" },
  twitch: { icon: Twitch, color: "bg-[#9146FF] hover:bg-[#7F3FE0]" },
} as const;

/**
 * @description OAuth button component for various providers
 * @param {OAuthButtonProps} props - The component props
 * @returns {JSX.Element} The rendered OAuth button
 */
export default function OAuthButton({
  provider,
  action,
}: OAuthButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = provider in providerConfig;
  const { icon: Icon, color } = isConfigured
    ? providerConfig[provider as ConfiguredProvider]
    : { icon: () => null, color: "bg-gray-500 hover:bg-gray-600" };

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

      
      const endpoint = `http://localhost:8000/auth/${action}/${provider}`;
      window.location.href = endpoint;
      
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",

      );
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        className={`w-full ${color} text-white flex items-center justify-center`}
        onClick={handleClick}
        disabled={!isConfigured || isLoading}
        aria-label={buttonText}
        aria-busy={isLoading}
        aria-disabled={!isConfigured || isLoading}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden="true" />}
        <span className="truncate">
          {isLoading ? "Loading..." : buttonText}
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