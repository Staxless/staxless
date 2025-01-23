/**
 * @file app/robots.ts
 * @description Generates the robots.txt configuration for the website
 */

import type { MetadataRoute } from "next";
import { siteMetadata } from "../../config"


/**
 * Generates the robots.txt configuration for the website.
 * @returns {MetadataRoute.Robots} The robots.txt configuration object
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // Applies the rules to all user agents
      allow: "/", // Allow all user agents to access the root
      disallow: "/dashboard/", // Disallow access to the /dashboard/ directory
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}
