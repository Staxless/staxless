/**
 * OAuthButton Component
 *
 * This component renders a button for OAuth authentication with the specified provider.
 * It supports various OAuth providers and displays an appropriate icon and styling based on the provider.
 * The button triggers the OAuth flow on click by sending a POST request to the authentication endpoint.
 *
 * @module components/ui/oauth-button
 */

import { Button } from "@/components/ui/button";
import { Github, Facebook, Twitter, Twitch, Apple, Gitlab } from "lucide-react";
import { FaGoogle, FaMicrosoft, FaDiscord, FaBitbucket } from "react-icons/fa";
import { SiAuth0, SiOkta } from "react-icons/si";

/**
 * List of supported OAuth providers.
 * @type {string}
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
 * Props for the OAuthButton component.
 */
interface OAuthButtonProps {
  provider: string; // OAuth provider (e.g., "google", "github")
  action: "login" | "register"; // Action to perform (login or register)
}

// Configuration for OAuth providers including icons and colors.
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
 * OAuthButton component renders a button for OAuth authentication with the specified provider.
 *
 * @param provider - The OAuth provider to use (e.g., "google", "github").
 * @param action - The action for the button, either "login" or "register".
 *
 * @returns The OAuthButton component.
 */
export default function OAuthButton({ provider, action }: OAuthButtonProps) {
  const isConfigured = provider in providerConfig;
  const { icon: Icon, color } = isConfigured
    ? providerConfig[provider as ConfiguredProvider]
    : { icon: () => null, color: "bg-gray-500 hover:bg-gray-600" };

  // Button text based on the action and provider
  const buttonText = `${action === "login" ? "Login" : "Register"} with ${
    provider.charAt(0).toUpperCase() + provider.slice(1)
  }`;

  /**
   * Handles button click event to initiate OAuth flow.
   *
   * Sends a POST request to the OAuth provider and redirects the user based on the response.
   */
  const handleClick = async () => {
    if (!isConfigured) {
      console.error(`Provider ${provider} is not configured`);
      return;
    }

    try {
      const response = await fetch(
        `http://front-gate:8080/auth/${action}/${provider}`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error("Failed to initiate OAuth flow");
      }
    } catch (error) {
      console.error("Error initiating OAuth flow:", error);
    }
  };

  return (
    <Button
      className={`w-full ${color} text-white flex items-center justify-center`}
      onClick={handleClick}
      disabled={!isConfigured}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span className="truncate">{buttonText}</span>
    </Button>
  );
}
