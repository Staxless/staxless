import getAllMDXContent from "@/lib/getAllMDXContent";
import getMDXFileContent from "@/lib/getMDXFileContent";

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

interface MDXData {
  title?: string;
  date?: string;
  excerpt?: string;
  authors?: string[];
}

/**
 * Retrieves all blog posts by fetching MDX file content from the "blog" directory.
 *
 * This function gets the list of all MDX files in the "blog" directory and fetches their content.
 * It maps the content to a standardized `BlogPost` format, including title, date, excerpt, and authors.
 *
 * @returns A promise that resolves to an object containing an array of `BlogPost` objects.
 */
export async function getBlogPosts(): Promise<Blogposts> {
  try {
    // Fetch all MDX content from the "blog" directory
    const allPosts = await getAllMDXContent("blog");

    // Fetch and map MDX file content to BlogPost objects
    const posts: BlogPost[] = await Promise.all(
      allPosts.map(async (post) => {
        const { data } = await getMDXFileContent({
          params: { slug: post.slug },
          baseDir: "blog",
        });
        const mdxData = data as MDXData;
        return {
          slug: post.slug,
          title: mdxData.title || "Untitled", // Default title if not available
          date: mdxData.date || "No date", // Default date if not available
          excerpt: mdxData.excerpt || "No excerpt available", // Default excerpt if not available
          authors: mdxData.authors || [], // Default to empty array if no authors provided
        };
      }),
    );

    return { posts };
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return { posts: [] }; // Return empty array in case of error
  }
}
