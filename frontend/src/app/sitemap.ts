import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/get-blog-post";

// Define the BlogPost interface here since it's not exported from getBlogPost
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  authors: string[];
}

interface Blogposts {
  posts: BlogPost[];
}

/**
 * Generates a sitemap for the website, including blog posts and static pages.
 * @returns {Promise<MetadataRoute.Sitemap>} A promise that resolves to a sitemap object.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch blog posts
  const blogposts: Blogposts = await getBlogPosts();

  // Map blog posts to sitemap entries
  const postEntries: MetadataRoute.Sitemap = blogposts.posts.map(
    (post: BlogPost) => ({
      url: `https://acme.com/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://acme.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://acme.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
  ];

  // Combine static pages and blog post entries
  return [...staticPages, ...postEntries];
}
