/**
 * @file Blog overview page for displaying the latest posts
 * @description Fetches and displays the latest blog posts from the API.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/get-blog-post";
import type { Metadata } from "next";
import { generateCustomMetadata , MetadataProps } from '../../../lib/generate-metadata'

// BlogPost interface defines the structure of each blog post object
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  authors: string[];
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {

  // Use our custom function to generate the metadata
  return generateCustomMetadata({
    title: `Legal: ${params.slug}`, // This will be used in the template
    description: `Legal Docs: ${params.slug}`,
    params,
  })
}
/**
 * Component
 * @description Asynchronous function that fetches blog posts and displays them
 * in a grid format. If no posts are available, a message will be shown.
 * @returns JSX.Element - Renders the blog posts or a "no posts found" message.
 */
export default async function Component() {
  const { posts } = await getBlogPosts(); // Fetch blog posts data

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        The latest Next.js news
      </h1>
      {/* Conditionally render blog posts or no posts found message */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: BlogPost) => (
            <div key={post.slug} className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-500 mb-2">{post.date}</p>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  {/* Map through authors and display them */}
                  {post.authors.map((author, index) => (
                    <span key={index} className="text-sm text-gray-600">
                      {author}
                    </span>
                  ))}
                </div>
                {/* Link to individual blog post */}
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline">Read More</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              No blog posts found
            </h2>
            <p className="mt-2 text-gray-600">
              Check back later for new content!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
