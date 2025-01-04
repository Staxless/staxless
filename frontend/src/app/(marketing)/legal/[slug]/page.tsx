/**
 * @file Legal Page
 * @description Displays legal documents rendered from MDX content.
 */

import { Inter } from "next/font/google";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXFileContent } from "@/lib/get-mdx-file-content";
import getAllMDXContent from "@/lib/get-all-mdx-content";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

/**
 * Props for the LegalPage component
 */
interface Props {
  params: { slug: string };
}

/**
 * MDXData interface for the title and description of the legal page
 */
interface MDXData {
  title?: string;
  description?: string;
}

/**
 * Generate metadata for the legal page
 * @param params - Contains the slug of the legal document
 * @returns Metadata object with title and description of the document
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await getMDXFileContent({
      params,
      baseDir: "legal",
    });
    const mdxData = data as MDXData;

    return {
      title: mdxData.title || "Legal Document",
      description: mdxData.description || "Legal information",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while generating metadata",
    };
  }
}

/**
 * Generate static params for dynamic legal document routes
 * @returns Array of params containing slugs for legal documents
 */
export async function generateStaticParams() {
  const mdx = await getAllMDXContent("legal");
  return mdx.map(({ slug }) => ({ slug }));
}

/**
 * LegalPage component
 * @description Renders a legal document by fetching its content via MDX
 * @param params - Contains the slug of the legal document
 * @returns JSX.Element for the legal page
 */
export default async function LegalPage({ params }: Props) {
  try {
    const { content } = await getMDXFileContent({ params, baseDir: "legal" });

    return (
      <div
        className={`min-h-screen bg-background flex flex-col ${inter.className}`}
      >
        <header className="w-full py-6 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">Company Name</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
          <article className="prose dark:prose-invert">
            {/* Render MDX content */}
            <MDXRemote source={content} />
          </article>
        </main>
        <footer className="w-full py-4 border-t">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Company Name. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error rendering legal page:", error);
    return <div>An error occurred while loading the legal document.</div>;
  }
}
