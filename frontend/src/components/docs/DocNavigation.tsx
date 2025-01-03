/**
 * @file DocNavigation Component
 * @module DocNavigation
 * @description A React component that renders a sidebar navigation menu for documentation.
 */

"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types and Interfaces
interface DocItem {
  name: string;
  slug: string;
  fullPath: string;
  subItems?: DocItem[];
}

interface DocNavigationProps {
  docStructure: DocItem[];
}

/**
 * @function toTitleCase
 * @description Converts a string to title case.
 * @param {string} str - The input string to be converted.
 * @returns {string} The converted title case string.
 */
function toTitleCase(str: string): string {
  return str
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * @function DocItem
 * @description Renders a single documentation item or a nested list of items.
 * @param {Object} props - The component props.
 * @param {DocItem} props.item - The documentation item to render.
 * @returns {JSX.Element} The rendered DocItem component.
 */
const DocItem = memo(({ item }: { item: DocItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.subItems) {
    return (
      <li className="mb-2">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full justify-start p-2 text-sm font-medium"
          aria-expanded={isOpen}
          aria-controls={`sub-items-${item.slug}`}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )}
          {toTitleCase(item.name)}
        </Button>
        {isOpen && (
          <ul id={`sub-items-${item.slug}`} className="ml-4 mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <DocItem key={subItem.slug} item={subItem} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/docs/${item.slug}`}
        className="block p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
      >
        {toTitleCase(item.name)}
      </Link>
    </li>
  );
});

DocItem.displayName = "DocItem";

/**
 * @function DocNavigation
 * @description Renders a sidebar navigation menu for documentation.
 * @param {DocNavigationProps} props - The component props.
 * @param {DocItem[]} props.docStructure - The hierarchical structure of documentation items.
 * @returns {JSX.Element} The rendered DocNavigation component.
 */
export function DocNavigation({ docStructure }: DocNavigationProps) {
  return (
    <nav className="w-64 lg:w-72 flex-shrink-0 border-r border-border h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full py-6 pl-6 pr-4">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <ul className="space-y-2">
          {docStructure.map((item) => (
            <DocItem key={item.slug} item={item} />
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
}

export default DocNavigation;
