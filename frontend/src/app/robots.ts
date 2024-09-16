import type { MetadataRoute } from "next";

/**
 * Generates the robots.txt configuration for the website.
 *
 * @returns The robots.txt configuration object.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // Applies the rules to all user agents
      allow: "/", // Allow all user agents to access the root
      disallow: "/dashboard/", // Disallow access to the /dashboard/ directory
    },
    sitemap: "https://acme.com/sitemap.xml", // URL to the sitemap for search engines
  };
}
