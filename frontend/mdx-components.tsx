/**
 * @file MDX Components Configuration
 * @module mdxComponents
 * @description Configures custom MDX components for use in the application.
 */

import type { MDXComponents } from "mdx/types";

/**
 * Configures and returns MDX components for use in the application.
 * This function allows for customization of MDX rendering by providing
 * custom components or modifying existing ones.
 *
 * @param {MDXComponents} components - The default MDX components
 * @returns {MDXComponents} The configured MDX components
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Add custom components or override existing ones here
  };
}
