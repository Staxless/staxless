/**
 * @file Legal Page
 * @description Displays legal documents rendered from MDX content.
 */

import { Inter } from "next/font/google";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXFileContent } from "@/lib/get-mdx-file-content";
import getAllMDXContent from "@/lib/get-all-mdx-content";
import type { Metadata } from "next";
import { generateCustomMetadata, MetadataProps } from '../../../../lib/generate-metadata'



const inter = Inter({ subsets: ["latin"] });


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

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {

  // Use our custom function to generate the metadata
  return generateCustomMetadata({
    title: `Legal | ${params.slug}`, // This will be used in the template
    description: `Legal Docs | ${params.slug}`,
    params,
  })
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
export default async function LegalPage({ params }: MetadataProps) {
  try {
    const { content } = await getMDXFileContent({ params, baseDir: "legal" });

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
  } catch (error) {
    console.error("Error rendering legal page:", error);
    return <div>An error occurred while loading the legal document.</div>;
  }
};
