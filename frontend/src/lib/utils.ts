import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names with optional merging and conditional logic.
 *
 * This function utilizes `clsx` to handle conditional class names and `twMerge` to merge
 * conflicting Tailwind CSS class names, ensuring that the final class name string is properly
 * formatted and optimized.
 *
 * @param inputs - A list of class names, which can include conditional class names or arrays.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  // Combine class names using clsx and resolve conflicts with twMerge
  return twMerge(clsx(inputs));
}
