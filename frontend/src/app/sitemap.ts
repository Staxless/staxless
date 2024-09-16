import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/getBlogPost";

interface BlogPost {
  slug: string;
  date: string; // The publication date of the blog post
}

interface Doc {
  slug: string;
  date: string; // The publication date of the document
}

/**
 * Generates a sitemap for the website, including blog posts and static pages.
 *
 * @returns A promise that resolves to a sitemap object.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch the blog posts
  const { posts } = await getBlogPosts();

  // Map blog posts to sitemap entries
  const postEntries: MetadataRoute.Sitemap = posts.map((post: BlogPost) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Add functionality for document entries if needed
  // Currently, there are no document entries included

  return [
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://acme.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://acme.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...postEntries,
  ];
}
