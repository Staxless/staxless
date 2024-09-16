/**
 * @file Blog post page
 * @description Displays a single blog post by fetching its MDX content.
 */

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { notFound } from "next/navigation";
import { getMDXFileContent } from "@/lib/getMDXFileContent";
import getAllMDXContent from "@/lib/getAllMDXContent";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import CTA from "@/components/landing/cta/simpleCta";

// Interface for BlogPost data
interface BlogPost {
  title: string;
  date: string;
  author: string;
  content: string;
}

// Props interface for component
interface Props {
  params: { slug: string };
}

// MDX data interface for metadata
interface MDXData {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
}

/**
 * Generate metadata for the blog post page
 * @param params - Page parameters containing the slug
 * @returns Metadata object with the blog post's title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getMDXFileContent({ params, baseDir: "blog" });
  const mdxData = data as MDXData;

  return {
    title: mdxData.title || "Blog Post",
    description: mdxData.description || "No description available",
  };
}

/**
 * Generate static params for dynamic blog routes
 * @returns Array of params containing slugs of all blog posts
 */
export async function generateStaticParams() {
  const mdx = await getAllMDXContent("blog");
  return mdx.map(({ slug }) => ({ slug }));
}

/**
 * Fetch a single blog post's data
 * @param params - Page parameters containing the slug
 * @returns BlogPost data or null if not found
 */
async function getBlogPost(params: { slug: string }): Promise<BlogPost | null> {
  const { content, data } = await getMDXFileContent({
    params,
    baseDir: "blog",
  });

  const mdxData = data as MDXData;

  if (!content && Object.keys(mdxData).length === 0) {
    return null;
  }

  return {
    title: mdxData.title || "Untitled Post",
    date: mdxData.date || "Unknown Date",
    author: mdxData.author || "Anonymous",
    content: content || "No content available.",
  };
}

/**
 * BlogPost component
 * @description Renders a blog post with its title, author, date, and content.
 * @param params - Page parameters containing the slug
 * @returns JSX.Element for the blog post page
 */
export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params);

  if (!post) {
    notFound(); // Redirect to a 404 page if post is not found
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Blog
          </Link>
        </div>
      </header>
      <div className="flex flex-1 mt-8">
        <TableOfContents />
        <main className="flex-1 max-w-3xl mx-auto px-4">
          <article className="prose lg:prose-xl dark:prose-invert">
            <h1>{post.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-gray-500">{post.date}</p>
              </div>
            </div>
            {/* Render the MDX content */}
            <MDXRemote source={post.content} />
          </article>
        </main>
      </div>
      <CTA />
    </div>
  );
}
