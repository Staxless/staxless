"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Interface representing an item in the Table of Contents (TOC).
 */
interface TOCItem {
  id: string;
  text: string;
}

/**
 * TableOfContents component generates a table of contents for the article based on h2 elements.
 * It provides smooth scrolling and navigation functionality to the headings.
 *
 * @returns {JSX.Element} - The TableOfContents component.
 */
export function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const article = document.querySelector("article");
      if (!article) {
        throw new Error("Article element not found");
      }

      const headings = Array.from(article.querySelectorAll("h2"));
      if (headings.length === 0) {
        throw new Error("No h2 elements found in the article");
      }

      const tocItems = headings.map((heading) => {
        const id =
          heading.id ||
          heading.textContent?.toLowerCase().replace(/\s+/g, "-") ||
          "";
        if (!id) {
          console.warn("Heading without id or text content found");
        }
        return {
          id,
          text: heading.textContent || "Untitled section",
        };
      });

      setToc(tocItems);
      setError(null);
    } catch (err) {
      console.error("Error generating table of contents:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  }, []);

  const handleClick = (id: string) => {
    if (!id) {
      console.warn("Attempted to navigate to an empty id");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      router.push(`#${id}`);
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  if (error) {
    return (
      <nav className="w-1/4 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">On this page</h2>
        <p className="text-red-500">{error}</p>
      </nav>
    );
  }

  return (
    <nav className="w-1/4 p-4 overflow-y-auto border-gray-200 border-l">
      <h2 className="text-xl font-bold mb-4">On this page</h2>
      {toc.length > 0 ? (
        <ul>
          {toc.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => handleClick(item.id)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contents available</p>
      )}
    </nav>
  );
}
